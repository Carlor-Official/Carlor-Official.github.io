# Linux QQ API 使用范围

Linux QQ 是萌卡 NT 1.8.2 的原生账号协议。它与 Android 账号共享插件 WebSocket 通道和 action 信封，但使用独立的账号存储、登录管理器、在线实例和事件来源。

```json
{
  "type": "action",
  "id": "request-id",
  "action": "send_group_msg",
  "params": {
    "self_id": 10000,
    "client_type": "linuxqq",
    "group_id": 20000,
    "message": "hello"
  }
}
```

官方 SDK 推荐使用：

```js
const linuxApi = api.forProtocol('linux')
await linuxApi.send_group_msg(self_id, group_id, message)
```

协议选择器接受以下写法：

| 写法 | Android | Linux QQ |
| --- | --- | --- |
| SDK | `api.forProtocol('android')` | `api.forProtocol('linux')` |
| `client_type` | `android` | `linuxqq`、`linux_qq`、`linux-qq` |

省略选择器时固定使用 Android。API 协议选择参数统一为 `client_type`，不要再传旧 `platform` 字段。同一 QQ 双协议在线时，框架绝不会把 Linux 请求交给 Android 实例，或反向转交。

## 原生 Linux QQ 已开放动作

| 类别 | 动作 |
| --- | --- |
| 系统 | `get_login_info`、`get_status`、`get_version_info`、`can_send_image`、`can_send_record`、`get_online_clients` |
| 消息 | `send_msg`、`send_private_msg`、`send_group_msg`、`send_friend_msg`、`send_group_temp_msg`、`delete_msg`、`recall_group_msg`、`get_msg`、好友/群历史和已读动作 |
| 联系人和群 | `get_friend_list`、`get_group_list`、`get_group_member_list` |
| 群管理 | 管理员、群名片、专属头衔、单人/全员禁言、单人/批量移出 |
| 媒体和文件 | 好友/群图片、群语音、群视频、私聊/群文件上传、合并转发读取与发送 |
| 登录凭证 | `get_skey`、`get_clientkey`（支持同名接口按 `client_type` 获取对应协议内容） |
| 等级任务 | 面板、计划、执行及等级加速汇总接口 |
| Bot 管理 | Bot 列表/信息、缓存检查/登录、离线和删除 |

未列出的 Bot 业务 action 默认仅 Android 可用。Linux 请求遇到未实现 action 会返回 `Linux QQ 暂不支持 action: <action>`，不会伪造成功结果。

## 登录流程

Android 使用 `add_account`、`login_account`、安全验证、短信和登录安全二维码。v2.5.9管理端 Linux 账号新增真正的账号密码登录，与免扫、扫码并列为三种方式。Linux 使用原生登录包及设备身份，签名来自云端。Android 支持 9.2.70，Linux 固定 3.2.32。

Linux 登录固定使用 `3.2.32`；`3.2.33` 已从协议目录和算法路由移除。升级时旧 `3.2.33` 账号会自动迁移到 `3.2.32`，不会删除账号、节点、设备身份或已有票据。

Linux 登录完整使用统一账号管理与原生二维码会话：管理端保存账号后，由 Linux 登录管理器创建二维码、查询状态并完成登录。人工扫码和免扫不会建立两套 Linux 会话；免扫只是由同 QQ 的在线 Android Bot 对这一个二维码依次执行 `scan_qr`、`auth_qr`，最终上线仍由 Linux 会话确认。插件 API 不应自行另建登录轮询。

已保存 Linux 票据时，可使用 `cache_login` 发起自动登录。缓存明确失效后才进入二维码流程；网络超时或签名服务临时失败不等于缓存失效，不应自动重复授权。

插件 `login_account` 的现有 Linux 二维码入口保持原契约；管理端账号密码登录走 Linux NTLogin。不要将登录二维码与密码登录后的设备验证二维码混用。

## 事件来源

私聊消息、群消息、好友事件、群事件、请求事件和下线事件继续使用萌卡 NT 原生事件结构。事件数据额外包含：

```json
{
  "platform": "linux",
  "client_type": "linuxqq"
}
```

插件应使用该字段选择自己的账号状态、缓存键和业务队列，不能只用 `self_id` 作为唯一键。
