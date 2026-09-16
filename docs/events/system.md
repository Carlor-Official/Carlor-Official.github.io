# 系统事件

## 连接生命周期

已订阅系统事件的插件连接完成认证后，框架立即发送一次 `system_lifecycle`。重新连接并认证后产生新的连接事件，不补发上一次连接的事件：

```js
api.on('system_lifecycle', event => {
  console.log(event.status, event.connected_at)
})
```

```js
{
  self_id: 0,
  client_type: 'framework',
  post_type: 'system_event',
  event_type: 'system_lifecycle',
  sub_type: 'lifecycle',
  status: 'connected',
  connected_at: '09-04 18:30'
}
```

## 连接心跳

已订阅系统事件的连接每 30 秒收到一次 `system_heartbeat`，它与 WebSocket 控制帧心跳同时发送，用于业务层确认事件通道仍在工作。

```js
api.on('system_heartbeat', event => {
  console.log(event.status, event.interval_seconds)
})
```

`status` 当前为 `alive`，`interval_seconds` 当前为 `30`。

这两个事件按连接独立生成，`self_id` 为 `0`、`client_type` 为 `framework`。不同 WS 的连接与心跳事件不共用 `event_id`；不要用账号事件的跨 WS 同 ID 规则校验它们。关闭 `system_event` 订阅会停止这两类业务事件，但不影响 WebSocket 控制帧心跳或已授权的 API 调用。当前生命周期事件只报告认证后的 `connected`，并未承诺向已断开的连接发送断线事件。

v2.0.6已在包含最新消息修复的测试候选上完成双正向和单反向 WS 的连接、重连及两轮心跳观察：6 次连接生命周期与 12 次实际周期心跳符合上述字段约定。另以四条未订阅系统事件的原始 WS 连接验证不收到这两类事件，控制心跳和只读 API 保持可用。这是连接层事件的专项结果，不代表全部业务来源或媒体能力验收完成。

## 账号上线

`account_online` 在原生登录完成、账号从非在线状态进入在线状态时触发。接入 Android 与 Linux 的统一登录成功状态转换，覆盖各协议已有的密码、缓存或扫码登录方式。不代表插件 WS 连接成功，也不在心跳或重复成功通知时重复广播。离线后再次成功登录会产生新的事件；插件连接前已发生的上线不会补发，可调用账号列表查询当前状态。

在 `connect()` 前注册监听器，SDK 会声明 `system_event` 权限。已审核的市场插件需获得该事件权限。

```js
api.on('account_online', event => {
  console.log(event.self_id, event.client_type, event.node_id)
})
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `self_id` | number | 上线账号 QQ 号 |
| `client_type` | string | `android` 或 `linuxqq`，不是 `framework` |
| `node_id` | number | 账号实际运行节点 |
| `post_type` | string | `system_event` |
| `sub_type` / `event_type` | string | `account_online` |
| `status` | string | `online` |
| `event_id` | string | 同次上线向多个合法 WS 投递时保持一致 |
| `occurred_at` | number | 毫秒 Unix 时间戳 |

## 账号离线

`account_offline` 在账号从在线状态进入离线状态时触发，包括主动停止、真实网络断开及会话失效。重复离线通知、对已离线账号再次停止、尚未成功上线的登录取消，不会产生新的离线事件。重新上线后再次离线会生成新的 `event_id`。在连接前注册监听器，SDK 会声明 `bot_offline` 权限。

```js
api.on('account_offline', event => {
  console.log(`Bot ${event.self_id} 已离线`)
  console.log(event.offline_reason, event.err_msg)
})
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `self_id` | number | 离线 Bot QQ 号 |
| `client_type` | string | 账号协议 |
| `post_type` | string | `bot_offline` |
| `offline_reason` | string | 框架归一化的离线原因 |
| `err_msg` | string | QQ 返回或框架生成的可读原因 |
| `event_id` | string | 同次离线向多个合法 WS 投递时保持一致 |
| `occurred_at` | number | 毫秒 Unix 时间戳 |

离线事件与框架登录状态使用同一判断源，不会因普通接口超时或非会话级错误误报全局离线。

v2.0.6已完成两个账号、Android/Linux 四会话、跨两节点和三 WS 的主动停止/缓存恢复，以及逐会话真实 TCP 断线/缓存恢复测试。每次只影响目标会话，网络断线原因是 `network_lost`；另一个协议或账号继续在线。真实被踢、真实票据过期不是本轮故障注入的覆盖项，不应将网络断线测试描述为所有离线原因都已实测。
