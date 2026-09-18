# Windows 部署

这篇教程按一台全新的 Windows 10/11 电脑编写。第一次部署不需要安装 Go、Node.js 或数据库，只需要下载正式包、解压并启动程序。

## 你将完成什么

1. 下载 Windows AMD64 正式包；
2. 用 PowerShell 校验并解压；
3. 启动框架并打开 WebUI；
4. 创建本地管理员账号和密码；
5. 添加节点、设备指纹和 QQ 账号；
6. 从「插件 → 插件导入」安装独立插件。

## 第 1 步：下载正确的文件

打开[下载与更新](/releases/)，进入框架 [v2.4.1 Release](https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.4.1)，下载下面两个文件到同一个目录：

- `mengka-nt-2.4.1-windows-amd64.zip`：Windows 64 位程序；
- `SHA256SUMS.txt`：完整性校验文件。

不要下载 Linux 包，也不要从网盘或不明镜像下载可执行文件。

![Windows 下载与解压启动示意图](/deploy/windows-download.svg)

## 第 2 步：校验文件

在下载文件夹空白处右键，选择“在终端中打开”，执行：

```powershell
Get-FileHash .\mengka-nt-2.4.1-windows-amd64.zip -Algorithm SHA256
```

把输出的 `Hash` 与 `SHA256SUMS.txt` 中 `windows-amd64.zip` 那一行逐字比较。两者完全一致才继续；不一致就删除压缩包并重新下载。

## 第 3 步：解压到独立目录

建议使用一个不含中文和空格的目录，例如 `C:\MengkaNT`。不要把程序解压到 `C:\Windows`、桌面同步目录或杀毒软件的隔离目录。

```powershell
New-Item -ItemType Directory -Force C:\MengkaNT | Out-Null
Expand-Archive .\mengka-nt-2.4.1-windows-amd64.zip -DestinationPath C:\MengkaNT\server -Force
Set-Location C:\MengkaNT\server
Get-ChildItem
```

看到 `mengka-nt.exe`、`data`（可能首次启动前还不存在）等文件后，目录就准备好了。

## 第 4 步：首次启动

在刚才的 PowerShell 窗口执行：

```powershell
.\mengka-nt.exe
```

保持这个窗口不要关闭。终端会输出 WebUI 地址，通常是 `http://127.0.0.1:<端口>/`。复制这个地址，在同一台电脑的浏览器打开。

如果只想临时查看调试信息，可以使用：

```powershell
.\mengka-nt.exe -debug
```

调试模式只用于排查问题，不建议长期运行。

## 第 5 步：初始化本地管理员

首次打开 WebUI 会进入“初始化本地管理员”页面：

1. 输入你要使用的管理员账号；
2. 设置一个新的管理员密码；
3. 点击“创建管理员并进入”；
4. 使用刚才的账号密码登录概览页。

这里不需要官网令牌，也不会向官网提交密码。管理员身份保存在当前框架实例的本地数据库中。

![Windows 初始化本地管理员示意图](/deploy/windows-first-run.svg)

::: warning 请先记好密码
本地管理员密码不会显示在官网或 Release 页面。忘记密码前不要删除 `data` 目录；升级时也必须保留 `data`，否则会丢失管理员、账号、插件和节点数据。
:::

## 第 6 步：添加第一个 QQ 账号

登录后按这个顺序操作：

1. 打开“节点”，确认默认节点在线，或添加你的 QSign/协议节点；
2. 打开“指纹”，创建一个与协议匹配的设备指纹；
3. 打开“账号”，点击“添加账号”，选择 QQ、协议、指纹和节点；
4. 点击“登录”，按页面提示完成滑块、短信或设备确认；
5. 回到概览，确认账号状态为“在线”，并查看运行日志。

## 第 7 步：导入独立插件

插件不是框架的一部分，也不会从官网插件市场自动下载。以用户系统为例：

1. 从[用户系统独立 Release](https://github.com/Carlor-Official/Mengka-User-System/releases/tag/v2.0.17-native-ipc)下载成品包和校验文件；
2. 在插件页点击“插件 → 插件导入”；
3. 上传 `.tar.gz` 或 `.zip`，阅读权限清单；
4. 确认安装后，在插件卡片中启动并查看“运行中 / IPC 已连接”。

## 升级 Windows 版本

1. 在插件页停止正在运行的插件，在框架概览中停止账号或准备维护窗口；
2. 关闭旧的 `mengka-nt.exe` 进程；
3. 完整复制备份 `C:\MengkaNT\server\data`；
4. 将新版本解压到新的临时目录，不要直接覆盖旧目录；
5. 保留旧目录的 `data`，只替换程序文件；
6. 启动新程序，浏览器访问终端输出的地址；
7. 验证管理员登录、QQ 在线、插件运行和消息收发后，再清理旧备份。

::: danger 不要覆盖 data
新包中的空目录不能覆盖旧版 `data`。如果升级后页面要求重新初始化管理员，先停止操作并恢复备份，通常说明启动目录指错或数据目录没有保留。
:::

## 常见问题

### 双击窗口一闪而过

不要双击运行。请在 PowerShell 中启动，这样可以看到错误信息；常见原因是目录权限、杀毒软件拦截或下载包不完整。

### 浏览器打不开 127.0.0.1

确认 PowerShell 窗口仍在运行，并使用终端实际打印的端口。远程服务器上的 `127.0.0.1` 只属于服务器本机，外部电脑应通过 SSH 隧道或 HTTPS 反向代理访问。

### 插件启动失败

先检查插件包的 `min_framework` 是否不高于当前框架版本，再查看插件卡片的脱敏日志。不要直接删除插件数据目录；先停止插件并重新导入经过校验的成品包。
