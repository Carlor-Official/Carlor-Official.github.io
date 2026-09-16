# Linux 部署

## 启动程序

```bash
chmod +x ./mengka-nt
./mengka-nt
```

## 使用 systemd 守护

以下路径仅为示例，请按实际安装位置调整：

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

[Install]
WantedBy=multi-user.target
```

保存为 `/etc/systemd/system/mengka-nt.service` 后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mengka-nt
sudo systemctl status mengka-nt
```

## Nginx 反向代理

将下方的 `127.0.0.1:6099` 替换成初始化时设置的实际监听端口：

```nginx
server {
    listen 443 ssl http2;
    server_name bot.example.com;

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

上线前还需要配置有效证书、防火墙/安全组和访问控制。不要把管理端口直接无保护暴露到公网。
