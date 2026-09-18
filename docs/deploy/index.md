# 部署总览

萌卡 NT 支持 Windows AMD64、Linux AMD64 与 Linux ARM64。开发机可直接运行；公网服务器建议使用进程管理器保持运行，并通过 Nginx 或同类网关提供 HTTPS 与 WebSocket 反向代理。

v2.4.0 起，首次访问新实例或旧官网版本升级后的实例，会直接进入本地管理员初始化页；v2.4.1 起原生插件通过 `native-ipc-v1` 运行。插件不再从官网市场下载，统一在「插件 → 插件导入」上传成品包。

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

## 导入原生插件

框架 v2.4.1 的原生插件使用 `native-ipc-v1`，不需要开放插件端口，也不需要填写 WebSocket 地址或服务令牌。以用户系统为例：

1. 从[用户系统独立 Release](https://github.com/Carlor-Official/mengka-user-system-source/releases/tag/v2.0.17-native-ipc)下载对应的外发包、包清单和 `SHA256SUMS.txt`；框架安装包仍从[框架 v2.4.1 Release](https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.4.1)获取；
2. 在本地校验包的 SHA-256，并确认包内 `mengka-plugin.json` 的 `min_framework` 为 `2.4.1`；
3. 登录框架管理端，打开「插件 → 插件导入」，上传 `.tar.gz`/`.zip` 成品包；
4. 阅读权限差异和可信来源提示后确认安装，在插件卡片中完成配置并启动；
5. 首次启动后查看日志和健康状态，确认显示“运行中 / IPC 已连接”再接入业务。

原生插件只应安装可信来源的成品包。升级前停止插件并备份 `data` 目录；卸载默认保留插件数据，不要手动删除数据目录作为“修复”步骤。
