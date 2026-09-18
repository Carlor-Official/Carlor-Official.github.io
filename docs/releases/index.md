# 下载与更新

<ReleasePanel detailed />

## 下载选择

| 文件标识 | 适用环境 |
| --- | --- |
| `windows-amd64.zip` | Windows 64 位 |
| `linux-amd64.tar.gz` | Linux x86_64 |
| `linux-arm64.tar.gz` | Linux ARM64 |
| `SHA256SUMS.txt` | 下载完整性校验 |

版本号、发布时间和文件列表自动读取官方 GitHub Releases。读取失败时仍可通过官方发布页下载，不会展示过期版本作为最新版。

框架 v2.4.1 的核心变化包括原生 IPC 插件运行、插件导入权限核对、配置管理与生命周期控制；v2.4.0 的本地管理员、协议目录和算法版本策略继续保留。

### v2.4.1 原生用户系统包

已验证的萌卡 NT 用户系统原生托管包随框架 v2.4.1 一起发布：

- [Linux AMD64 外发包](https://github.com/Carlor-Official/Mengka-NT/releases/download/v2.4.1/mengka-user-system-2.0.17-managed-native-linux-amd64.tar.gz)
- [包清单与 SHA-256](https://github.com/Carlor-Official/Mengka-NT/releases/download/v2.4.1/linux-amd64-native.json)
- [完整校验文件](https://github.com/Carlor-Official/Mengka-NT/releases/download/v2.4.1/SHA256SUMS.txt)

该包版本为 `2.0.17`，最低框架版本为 `2.4.1`，传输方式为 `native-ipc-v1`。下载后进入框架「插件 → 插件导入」上传，核对包内权限清单并确认安装；框架不会从官网自动下载或更新插件。

[全部发布记录](https://github.com/Carlor-Official/Mengka-NT/releases) · [升级检查单](/releases/upgrade.html)
