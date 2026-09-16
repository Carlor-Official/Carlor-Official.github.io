# 认识萌卡 NT

萌卡 NT（Mengka NT）是一套面向 QQ NT 协议的跨平台机器人框架。它把账号、设备指纹、连接节点、插件服务和运行状态集中到 Web 管理界面，并通过插件 WebSocket 与 Node.js SDK 提供消息、联系人、群管理及扩展业务能力。

::: warning 当前站点状态
这是萌卡 NT 2.0 官网的预发布版本。框架当前正式版为 **v2.3.8**，请只从官方 GitHub Releases 下载外发包。
:::

## 核心能力

| 模块 | 能力 |
| --- | --- |
| 账号管理 | 多 QQ 账号统一管理，支持缓存、密码登录及安全验证流程 |
| 协议与设备 | 为账号独立选择协议、设备指纹和连接节点 |
| 消息与群 | 消息收发、联系人、群成员与常用群管理能力 |
| 插件系统 | 正向/反向 WebSocket、Node.js SDK、WebUI SDK 与统一 action 结果 |
| 可视化管理 | 账号、节点、插件、容器、令牌、日志和消息面板 |

## 支持平台

| 平台 | 架构 | 正式包 |
| --- | --- | --- |
| Windows | AMD64 / x86_64 | `mengka-nt-*-windows-amd64.zip` |
| Linux | AMD64 / x86_64 | `mengka-nt-*-linux-amd64.tar.gz` |
| Linux | ARM64 / AArch64 | `mengka-nt-*-linux-arm64.tar.gz` |

[开始安装 →](/guide/getting-started)
