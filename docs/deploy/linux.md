# Linux 部署

这篇教程适合 Ubuntu、Debian、Rocky Linux 等常见 Linux 服务器。下面以 `x86_64`（AMD64）为例；ARM64 服务器请把安装包文件名替换成 `linux-arm64`。

## 你将完成什么

1. 下载并校验 Linux 正式包；
2. 解压、授权并启动框架；
3. 通过 SSH 隧道完成首次管理员初始化；
4. 使用 systemd 后台守护；
5. 使用 Nginx 提供 HTTPS 和 WebSocket；
6. 导入独立插件并完成健康检查。

## 第 1 步：准备服务器

先确认架构和基础工具：

```bash
uname -m
sudo apt update
sudo apt install -y ca-certificates curl tar
```

`uname -m` 输出 `x86_64` 时下载 AMD64 包；输出 `aarch64` 时下载 ARM64 包。生产服务器建议单独创建 `mengka` 用户，不要让框架长期以 root 身份运行。

## 第 2 步：下载并校验正式包

打开[下载与更新](/releases/)，进入 [v2.4.1 Release](https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.4.1)，在服务器执行（AMD64 示例）：

```bash
sudo mkdir -p /opt/mengka-nt
cd /opt/mengka-nt
sudo curl -fL -O https://github.com/Carlor-Official/Mengka-NT/releases/download/v2.4.1/mengka-nt-2.4.1-linux-amd64.tar.gz
sudo curl -fL -O https://github.com/Carlor-Official/Mengka-NT/releases/download/v2.4.1/SHA256SUMS.txt
sudo sha256sum -c SHA256SUMS.txt --ignore-missing
```

只有看到 `mengka-nt-2.4.1-linux-amd64.tar.gz: OK` 才继续。校验失败时不要解压，删除文件后重新下载。

![Linux 下载、授权与首次启动示意图](/deploy/linux-install.svg)

## 第 3 步：解压并启动一次

```bash
sudo tar -xzf mengka-nt-2.4.1-linux-amd64.tar.gz
sudo chmod +x ./mengka-nt
sudo ./mengka-nt
```

保持 SSH 窗口打开，等待终端打印 `WebUI ready` 和访问地址。首次启动只需要运行一次来创建管理员；生产环境完成初始化后，再改用下面的 systemd 守护方式。

## 第 4 步：安全地打开首次初始化页面

如果框架运行在远程服务器，不要直接把管理端口加入安全组。先在本地电脑建立 SSH 隧道（把 `6099` 替换成终端显示的实际端口）：

```bash
ssh -L 6099:127.0.0.1:6099 root@你的服务器地址
```

然后在本地浏览器打开 `http://127.0.0.1:6099/`。首次访问会进入“初始化本地管理员”：

1. 输入管理员账号；
2. 设置并确认管理员密码；
3. 创建管理员并登录概览；
4. 确认登录成功后关闭临时启动窗口。

管理员凭据只保存在当前服务器的本地数据中，不需要官网令牌。

## 第 5 步：配置 systemd 守护

创建专用用户和目录权限：

```bash
sudo useradd --system --home /opt/mengka-nt --shell /usr/sbin/nologin mengka || true
sudo chown -R mengka:mengka /opt/mengka-nt
```

创建服务文件 `/etc/systemd/system/mengka-nt.service`：

```ini
[Unit]
Description=Mengka NT
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mengka
WorkingDirectory=/opt/mengka-nt
ExecStart=/opt/mengka-nt/mengka-nt
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

加载并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mengka-nt
sudo systemctl status mengka-nt --no-pager
```

看到 `active (running)` 后，再按下面的命令查看日志：

```bash
sudo journalctl -u mengka-nt -n 100 --no-pager
```

![Linux systemd 守护与健康检查示意图](/deploy/linux-service.svg)

## 第 6 步：用 Nginx 提供 HTTPS

管理端口建议只监听 `127.0.0.1`，公网仅开放 80/443。安装 Nginx：

```bash
sudo apt install -y nginx
```

站点配置示例（将域名、证书路径和端口换成你的实际值）：

```nginx
server {
    listen 443 ssl;
    server_name bot.example.com;

    ssl_certificate     /etc/letsencrypt/live/bot.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bot.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:6099;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

检查并重新加载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

上线前请确认 DNS 已指向网关、证书覆盖域名、防火墙只开放必要端口。不要把框架管理端口、原生插件端口或令牌直接暴露到公网。

## 第 7 步：添加账号与导入插件

登录 WebUI 后按“节点 → 指纹 → 账号”的顺序添加 QQ。用户系统等原生插件从[独立 Release](https://github.com/Carlor-Official/Mengka-User-System/releases/tag/v2.0.17-native-ipc)下载，进入「插件 → 插件导入」上传并确认权限。原生插件通过 `native-ipc-v1` 与框架通信，不需要额外开放插件端口。

## 升级 Linux 版本

1. 停止插件和 QQ 账号，执行 `sudo systemctl stop mengka-nt`；
2. 备份 `/opt/mengka-nt/data`；
3. 将新包解压到新的临时目录并重新校验；
4. 只替换程序文件，不删除或覆盖 `data`；
5. 执行 `sudo systemctl start mengka-nt`；
6. 查看 `systemctl status` 和 `journalctl`，再验证 WebUI、QQ 和插件状态。

::: danger 不要用 root 直接覆盖数据
数据目录包含本地管理员、账号、节点、插件和运行状态。升级前没有备份时不要尝试“清空重装”；先停止服务并制作备份。
:::

## 常见问题

### `Permission denied`

执行 `chmod +x ./mengka-nt`，并确认 `ExecStart` 指向真实文件路径。不要通过 `sudo` 运行一遍后再让 systemd 使用另一个用户，避免数据目录归属混乱。

### 服务启动后马上退出

先执行 `sudo journalctl -u mengka-nt -n 100 --no-pager`。常见原因是端口被占用、架构下载错误或 `data` 目录不可写。

### Nginx 页面能打开但 WebSocket 断开

检查 `proxy_http_version 1.1`、`Upgrade` 和 `Connection` 三个配置，并确认上游端口与框架终端打印的监听端口一致。
