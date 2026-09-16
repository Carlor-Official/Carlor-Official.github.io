# 部署总览

萌卡 NT 支持 Windows AMD64、Linux AMD64 与 Linux ARM64。开发机可直接运行；公网服务器建议使用进程管理器保持运行，并通过 Nginx 或同类网关提供 HTTPS 与 WebSocket 反向代理。

## 选择平台

- [Windows 部署](/deploy/windows.html)：适合桌面环境、快速体验和本地机器人。
- [Linux 部署](/deploy/linux.html)：适合服务器长期运行，包含 systemd 与 Nginx 示例。

## 上线前检查

- 已备份原有 `data` 目录；
- 使用的安装包与 CPU 架构匹配；
- 外网只开放必要端口；
- 管理入口已启用 HTTPS；
- WebSocket 反向代理已保留 Upgrade/Connection 头；
- 配置、数据库、令牌与登录缓存未进入公开仓库。
