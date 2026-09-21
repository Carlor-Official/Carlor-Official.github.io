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

框架 v2.4.3 固定 Linux QQ `3.2.32` 登录链路，移除 `3.2.33` 及其算法路由，并修复“电脑QQ在线”和“听歌领金币兑换加速”；v2.4.1 的原生 IPC 插件运行、插件导入权限核对、配置管理与生命周期控制继续保留。

### 用户系统独立原生外发包

用户系统不是框架组成部分，已验证的原生外发包在用户系统自己的 Release 中独立发布：

- [用户系统独立 Release v2.0.17-native-ipc](https://github.com/Carlor-Official/Mengka-User-System/releases/tag/v2.0.17-native-ipc)
- [Linux AMD64 外发包](https://github.com/Carlor-Official/Mengka-User-System/releases/download/v2.0.17-native-ipc/mengka-user-system-2.0.17-managed-native-linux-amd64.tar.gz)
- [包清单与 SHA-256](https://github.com/Carlor-Official/Mengka-User-System/releases/download/v2.0.17-native-ipc/linux-amd64-native.json)

该包版本为 `2.0.17`，最低框架版本为 `2.4.1`，传输方式为 `native-ipc-v1`。下载后进入框架「插件 → 插件导入」上传，核对包内权限清单并确认安装；框架不会从官网自动下载或更新插件。

[全部发布记录](https://github.com/Carlor-Official/Mengka-NT/releases) · [升级检查单](/releases/upgrade.html)
