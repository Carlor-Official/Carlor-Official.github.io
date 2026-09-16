# 插件文章示例：B站综合插件

这是发布表单自动生成的插件文章示例。真实提交时在发布页填写资料、API 和事件权限即可，不需要手写市场 JSON，也不需要再次进入投稿流程。

## 插件发布信息

| 项目 | 填写内容 |
| --- | --- |
| 插件 ID | `Bilibili-Utility-Suite` |
| 版本 | `1.4.6` |
| Windows 下载地址 | `https://github.com/Carlor-Official/Bilibili-Utility-Suite/releases/download/1.4.6/BilibiliSuite-1.4.6-windows-x86_64.zip` |
| Linux 下载地址 | `https://github.com/Carlor-Official/Bilibili-Utility-Suite/releases/download/1.4.6/BilibiliSuite-1.4.6-linux-x86_64.tar.gz` |
| 接入模式 | 正向 WebSocket + 反向 WebSocket |
| 监听端口 | `3050` |
| 网页后台 | 是 |
| 调用 API | `get_group_list，upload_friend_image，send_group_msg，upload_group_image` |
| 订阅事件 | `group_message，friend_message，bot_offline` |

## 插件简介

B站综合插件通过萌卡 NT 的 WebSocket 接收机器人事件，为群聊和私聊提供 Bilibili 查询、订阅、链接解析与通知能力。Windows 与 Linux 共用同一套 Web 管理界面。

> 在真实文章中，这里应放插件界面或实际消息效果截图，而不是重复放置 Logo。

## 主要功能

| 功能 | 说明 |
| --- | --- |
| 订阅与通知 | 动态、直播、番剧更新等内容提醒 |
| 信息查询 | 用户、直播间、动态和视频查询 |
| 链接解析 | 识别常见 B站分享链接 |
| 可视化管理 | 账号、订阅、群配置与运行日志 |
| 多账号隔离 | 每个机器人 QQ 独立保存授权与配置 |

## 安装和对接

1. 在萌卡 NT 的“插件市场”找到本插件并点击“安装”。
2. 安装完成后点击“添加服务”，确认监听端口和接入模式。
3. 如插件提供 Web 后台，可直接从插件市场卡片打开。
4. 在插件后台完成账号授权与功能配置。

上表中的 API 与事件来自官网审核快照，是框架安装和运行时授权的唯一来源。安装包无需包含 `mengka-plugin.json`，包内字段也不会改变权限范围。

## 使用示例

```text
哔哩菜单
用户信息 123456
订阅动态 123456
```

## 当前版本

- 支持 Windows 与 Linux；
- 支持框架快捷安装与添加服务；
- 支持从插件市场打开 Web 管理后台。

## 反馈

请在插件主页提供明确的问题反馈入口，并说明提交问题时需要携带哪些日志。
