# 原生 LinuxQQ 协议证据表

本文只记录可观察行为、脱敏字段形状和独立实现的验证入口，不包含腾讯源码、账号票据、二维码签名、设备秘密、PCAP 或反编译工程。

## 基线

| 项目 | 固定值 | 证据 |
| --- | --- | --- |
| 检查日期 | 2026-08-28 | 实施开始时重新读取 QQ 官方 `pcConfig.json` |
| LinuxQQ | `3.2.32-51802`，amd64 | 官方配置和 DEB 包元数据 |
| DEB 大小 | `184998970` bytes | 下载后本地只读校验 |
| DEB SHA-256 | `81AE2B8542EF5311FC72ECF53C9A523923C834569C7B0DA52E0BF4360B9CB5F9` | 下载后本地只读校验 |
| QUA / package sign | `V1_LNX_NQ_3.2.32_51802_GW_B` | 官方包静态字符串及调用点交叉引用 |

官方安装包、解包内容、反编译结果、抓包和分析工程位于源码树外的研究目录，不由 Go embed、前端构建或发布脚本引用。

## LinuxQQ 登录调用与帧

| 符号或调用点 | 请求命令/行为 | 字段和常量 | 加密层 | 证据与独立实现 |
| --- | --- | --- | --- | --- |
| `getQRCodePicture` | `wtlogin.trans_emp`，Code2D `0x31` 获取二维码 | SSO `app_id=537376854`、`magic=2052`；主登录 AppID `1600001615`；shell AppID `537376650` | 匿名 PC Code2D ECDH + TEA | 官方客户端离线调用图、脱敏 PCAP SSO 头和 `TestNativeLinuxQQCode2DFrameMatchesOfficialAnonymousEnvelope` |
| `startPolling` | `wtlogin.trans_emp`，Code2D `0x31` 轮询 | 本次 attempt 的 QR signature；状态只允许等待扫描、等待确认、成功、过期或取消 | 与获取二维码相同的 ECDH 会话 | 静态调用图、响应分支和二维码状态测试 |
| `abortPolling` | 取消当前 attempt 并销毁 QR 上下文 | attempt ID、创建时间、QR signature 只驻留内存 | 不复用旧 ECDH/QR 密钥 | 状态机测试；取消不得清除上一份仍有效的缓存票据 |
| `quickLoginWithUin` | 本地票据恢复后调用 `StatusService.Register` | UIN、UID、T10A/会话票据、独立 Linux 设备资料 | 已登录 SSO 封装 | 静态调用图、登录头测试和缓存成功/失败测试 |
| `setAutoLogin` | 设置本地登录策略 | `auto` 或 `qr`；旧 `quick`/`ticket` 只作为 `auto` 输入别名 | 无独立网络请求 | 账号存储和登录管理器契约测试 |
| `getLoginList` | 枚举本地 LinuxQQ 登录记录 | `(self_id, client_type=linuxqq)`；不读取安卓实例作为同一运行对象 | 无 | 双协议运行时测试 |
| `resetLoginInfo` | 清理确定失效的 LinuxQQ 会话 | 仅 LinuxQQ token/uid/nickname 会话字段 | 无 | 协议隔离与缓存持久化测试 |
| `deleteLoginInfo` | 删除 LinuxQQ 本地账号记录 | 不删除同 QQ 安卓账号或票据 | 无 | CRUD 与协议隔离测试 |
| 注册调用点 | `StatusService.Register` | LinuxQQ QUA、GUID、UID/UIN、在线状态 | 已登录 SSO 封装 | 静态调用图；LinuxQQ 重连分支测试 |
| 心跳调用点 | LinuxQQ 注册结果驱动的连接心跳 | 心跳周期由 MSF 运行时维护，不硬编码为等级任务计时器 | 已登录 SSO 封装 | 运行时状态和重连测试 |

`537376854` 不是从安装包元数据猜测的值：当前基线的脱敏 PCAP 中，`wtlogin.trans_emp` 外层 SSO 头同时出现 `app_id=537376854` 和 `magic=2052`。常量变化时必须同时更新抓包证据和 golden test，禁止只改常量让测试通过。

## Reserve

| protobuf 字段 | 内容 | 证据等级 |
| --- | --- | --- |
| `12` | 小写设备 GUID | 官方帧与静态调用点交叉确认 |
| `13` | 单字节 `0` | 官方帧 |
| `15` | W3C `traceparent` 形状，随机 trace/span ID | 官方帧形状；每次请求重新生成 |
| `23` | `client_conn_seq` 子消息 | 官方帧与调用点 |
| `24` | 客户端信息；包含 32-byte 随机值和 QUA | 官方帧与静态字符串 |
| `26` | `101` | 官方帧 |

实现位于 `internal/sso/linuxqq.reserve.go`。随机字段的 golden test 只校验结构、长度和固定字段，不固化真实随机数。

## 安卓协议自动授权

| 操作 | 命令 | 绑定条件 | 加密层 | 证据与测试 |
| --- | --- | --- | --- | --- |
| 识别/检查 | `wtlogin.qrlogin` / `0x13` | 同一 QQ、在线安卓实例、本次未过期 Code2D `qrSig` | Code2D 层使用 STKey TEA；外层使用 WTSessionTicketKey TEA | 官方安卓 QQ 9.2.70 离线控制流；`TestWTLoginAndroidQRCodeOperationsUseBoundTicketLayers` |
| 同意授权 | `wtlogin.qrlogin` / `0x14` | 在上述条件上要求 A1、A2、NoPicSig、ST 等完整有效票据 | 同上 | 官方安卓离线控制流及双层解密结构测试 |
| 取消/拒绝 | `wtlogin.qrlogin` / `0x16` | 只允许取消本次 attempt，不接受旧 `qrSig` | 同上 | 官方安卓离线控制流及 operation golden test |

官方 3.2.32 实网响应中，二维码 URL 的可打印 `k` 参数与 Code2D 二进制 `qrSig` 并不相同；Android 的扫描和授权请求使用后者。匿名官方网络冒烟会同时确认 URL `k` 存在和本次会话 `qrSig` 已绑定，单元测试保证自动授权不会误用 URL 文本。

任何票据、二维码授权密钥、设备秘密和完整响应体都不得写入日志、API、事件或本文档。实机差分只允许记录状态码、字段是否存在、长度和状态迁移。

## 负向审计

原生 LinuxQQ 运行链不得引用 `desktopqq`、Docker 桌面容器、Linux 桌面窗口、Electron 控制、截图识别、键鼠模拟或固定 GUI 流程。小米 8 Hook 仅用于脱敏验收与抓包诊断，不是框架运行时依赖；其中已有的 UI 扫码/点击辅助入口不得接入本实现。
