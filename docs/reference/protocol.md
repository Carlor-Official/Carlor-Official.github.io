# 通信协议

官方 Node.js SDK 已封装本页协议。其他语言可以按照以下 JSON 帧实现 WebSocket 客户端或服务端。

## API 请求

```json
{
  "type": "action",
  "id": "1",
  "action": "get_group_list",
  "params": {
    "self_id": 123456789,
    "client_type": "android"
  }
}
```

| 字段 | 说明 |
| --- | --- |
| `type` | 固定为 `action` |
| `id` | 请求标识；需要响应时必须提供 |
| `action` | API 名称 |
| `params` | API 参数对象 |

请求通过插件服务令牌认证。`send_packet` 沿用普通 action 链路，无需额外专属 Key；参数、在线账号和协议路由校验仍然生效。不要在 action 外层或 `params` 中附加旧版 `access_key`。具体接口条件以 [API 参考](/api/)与目标 Release 的 SDK 为准。

## API 响应

成功：

```json
{
  "type": "action_result",
  "id": "1",
  "ok": true,
  "data": {}
}
```

失败：

```json
{
  "type": "action_result",
  "id": "1",
  "ok": false,
  "error": "bot 未在线"
}
```

SDK使用 `id` 关联请求。默认超时为 30 秒，媒体、红包、头像和批量任务等 API 会设置更长超时。`like_qzone_feed` 和 `unlike_qzone_feed` 是无需响应的 API，SDK发送时不附带 `id`。

流式下载会在最终 `action_result` 之前发送一个或多个 `action_stream`。两种帧使用相同的 `id`，调用方应按顺序消费 `data` 中的 `file_info`、`file_chunk`，并以最终 `action_result.data.data_type = file_complete` 作为完成标志：

```json
{
  "type": "action_stream",
  "id": "1",
  "ok": true,
  "data": {
    "type": "stream",
    "data_type": "file_chunk",
    "index": 0,
    "data": "SGVsbG8=",
    "size": 5,
    "progress": 100
  }
}
```

市场安装的服务只能调用安装授权快照中的 action。未获授权时仍返回对应 `id` 的失败响应，例如：

```json
{
  "type": "action_result",
  "id": "1",
  "ok": false,
  "error": "action 未获服务授权: send_group_msg"
}
```

同一连接上的 action 会并发执行，当前每连接最多同时运行 16 个；响应顺序不保证与请求顺序一致。SDK根据 `id` 匹配 Promise，因此调用方可以安全地使用 `Promise.all`。连续 `await` 仍会由调用方形成串行。

## 事件帧

```json
{
  "type": "event",
  "data": {
    "self_id": 123456789,
    "post_type": "group_message"
  }
}
```

`data.event_type` 是精确事件名，`data.category` 是语义分类，`data.post_type` 是大类监听入口。完整事件包含 `event_id`、`occurred_at`、`self_id` 和 `client_type`，上面仅为帧结构示意。当前 26 个精确事件及字段见[事件参考](/events/)。

市场服务只接收授权快照中的事件；手工服务按照连接声明的事件权限接收事件。

## 控制与生命周期帧

市场托管插件可在同一连接接收 `lifecycle`、`job_trigger` 和可选 `http_webhook`，并发送 `control_register`。框架用 `control_result` 回应注册结果。控制帧不会改变官网审核快照中的 action/event 权限，断线后注册任务也会失效。完整字段和限制见[插件托管与权限协议](/reference/plugin-extension-v2.html)。

## 心跳

正向 Node.js SDK每 30 秒发送应用层心跳：

```json
{ "type": "ping" }
```

萌卡NT返回：

```json
{ "type": "pong" }
```

反向模式同时使用 WebSocket Ping/Pong 控制帧维持连接。自定义实现应正确响应控制帧。

## API 作用域

账号 action 使用 `self_id + client_type`；无 Bot 的全局接口不传账号。一般 Bot 业务调用必须满足：

- 框架中存在与 `self_id + client_type` 唯一对应的账号，并能找到该账号自己的登录节点。
- Bot 当前在线。
- 参数中包含有效的 `self_id`。

不满足条件时会收到 `ok: false` 的 `action_result`。

新增账号、读取配置、缓存检查、登录、停止登录等管理操作有各自状态要求，不要求账号事先在线。请按具体接口说明处理，不要为调用登录 API 先要求账号在线。
