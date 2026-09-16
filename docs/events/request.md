# 请求事件

请求事件的 `category` 固定为 `request`，可通过 `request` 大类监听。

当前契约对应框架 v2.0.6。推荐声明 `request: true`，SDK 应在连接前注册监听器；好友申请必须有 `request`，群申请当前接受 `request` 或 `group_event` 任一权限。权限只决定是否投递已有事件，不会主动制造申请。普通账号请求按事件的 `self_id + client_type` 路由，不按 WS 固定节点分割。

## 好友申请

QQ 推送好友申请提示后，框架会回读好友系统消息，以接口返回的数据生成事件，而不是猜测提示包字段。

```js
api.on('friend_request_received', event => {
  console.log(event.user_id, event.comment)
})
```

```js
{
  self_id,
  post_type: 'request',
  request_type: 'friend',
  sub_type: 'add',
  user_id,
  nickname,
  comment,
  source,
  flag,
  requested_at
}
```

`flag` 是不透明请求标识，调用 `set_friend_add_request` 时必须与事件的 `self_id`、`client_type` 一起原样传回。不同协议的原生申请标识可以不同，不能跨协议搬用或解析成数字。

Android 与 Linux 都由原生申请提示触发系统消息回读，普通申请与同意结果按原生状态区分，不依赖通知文案。同一账号/协议的重复提示按 `flag` 去重；不同协议分别生成账号事件，同一账号事件在多条合法 WS 中保持同一个 `event_id`。仅有 UID 时提供 `user_uid`，不把未知 QQ 号伪装为 `user_id: 0`。

处理流程：保存真实事件 → 用户确认同意或拒绝 → 使用同一账号、协议与原样 `flag` 调用 `set_friend_add_request` → 查询好友列表确认实际关系。拒绝不产生 `friend_added`；再次申请必须使用新事件的 `flag`。网络超时不代表审批未执行，不应自动重复审批。

`get_doubt_friends_add_request` 只查询 Android 的可疑申请，不能作为普通申请的总表，空列表也不代表没有收到普通申请。断线期间不保证重放申请事件；已保存的标识在处理前仍由框架回读验证，失效时返回错误。

无需验证的直接添加不是待审批申请。在已验证的策略0场景中，只有发起方好友列表新增关系，原生好友新增事件也只投递给发起方的在线协议会话；接收方没有产生待审批申请。不要用缺少申请事件判定这一分支失败，应核对该账号自己的好友列表。

## 入群申请与邀请

```js
api.on('group_request_received', event => {
  console.log(event.group_id, event.user_id, event.request_id)
})
```

| 字段 | 说明 |
| --- | --- |
| `group_id`, `group_name` | 目标群 |
| `user_id`, `nickname` | 申请者 |
| `user_uid` | 原生申请者 UID；没有可确认 QQ 号时保留 UID，不填 `user_id: 0` |
| `comment` | 申请附言，存在时返回 |
| `request_id`, `request_type` | 原生请求标识 |
| `request_extra` | 附加请求标识，存在时返回 |
| `invitor_id`, `invitor_nickname` | 邀请者，邀请入群时返回 |
| `invitor_uid` | 原生邀请者 UID，存在时返回 |

`request_id`、`request_type` 和 `request_extra` 应原样用于入群申请处理接口。

框架按原生群、类型、状态、申请者及已知邀请者/处理者匹配当前申请，再选最新服务器序号；不会用已处理记录遮蔽新申请。缺少 QQ 号但有有效 UID 时保留 UID。空响应不当成审批成功，同一账号/协议的相同请求短时去重。

收到请求后，通过 `approve_group_apply` 或 `reject_group_apply` 使用原事件的账号、协议及请求标识处理。`group_member_joined` 表示已加入，不是待审批请求，不能拿成员事件虚构申请编号。主动提交 `send_group_join_request` 仅支持 Android；Linux 接收和审批是独立能力，不能与 Linux 主动提交混淆。

## 已验证范围

v2.0.6 发布前已使用两个 QQ、Android/Linux、两节点及双正向/单反向 WS 验证好友申请接收、拒绝旧标识、再次申请、同意与关系确认，以及 Android 入群申请、跨协议审批、拒绝后无虚假加入、新申请批准及成员关系恢复。Linux 主动好友申请已覆盖有目标 UID 的场景；无 UID 缓存的陌生账号、群邀请待审批和任意外部通知模板未包含在该实测范围内。
