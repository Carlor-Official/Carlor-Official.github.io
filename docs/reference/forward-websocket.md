# 正向 WebSocket

正向模式下，萌卡 NT 监听一个 WebSocket 端口，外部服务作为客户端连接框架。这个入口在管理后台的「插件 → 插件对接」中创建，不依赖官网账号或插件市场。

## 后台配置

点击「添加服务」，选择「正向 WS」，填写服务名称、监听端口和服务令牌。服务不绑定固定节点，普通账号 action 由框架按照 `self_id + client_type` 路由到账号自己的登录节点。

```text
ws://HOST:PORT/
```

同一端口只能由一个服务使用。跨主机连接时，只开放实际需要的监听端口，并通过防火墙限制来源。

## Node.js SDK

```js
const api = createAPI({
  host: '127.0.0.1',
  port: 3001,
  token: 'TOKEN',
  name: 'plugin-name',
  version: '1.0.0',
  author: 'developer',
})

api.on('friend_message', handleFriendMessage)
await api.connect()
```

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | 否 | `127.0.0.1` | 萌卡 NT 所在主机 |
| `port` | 否 | `3001` | 后台配置的监听端口 |
| `token` | 是 | 无 | 服务令牌 |
| `name` | 是 | 无 | 连接列表显示名称 |
| `version` | 是 | 无 | 外部服务版本 |
| `author` | 是 | 无 | 开发者名称 |

正向 SDK 不主动重连。需要持续运行的服务应在断开后按自身策略重新调用 `connect()`，但不能自动重放可能产生副作用的 action。

## 原始认证帧

使用其他语言实现客户端时，连接建立后 10 秒内发送：

```json
{
  "type": "auth",
  "token": "TOKEN",
  "name": "plugin-name",
  "version": "1.0.0",
  "author": "developer",
  "permissions": {
    "group_message": true,
    "friend_message": true,
    "group_event": true,
    "friend_event": true,
    "bot_offline": true
  }
}
```

认证成功返回 `{ "type": "auth_ok" }`。认证失败返回 `auth_failed` 并断开连接。后续帧见[通信协议](/reference/protocol.html)。

## 外部管理端

创建或编辑手动服务时，可以填写 `http://` 或 `https://` 管理端基础地址。填写后，服务卡片显示「进入管理端」，框架会为已登录的本地管理员发起一次性 SSO 跳转。

管理端地址只用于入口和 SSO，不替代 WebSocket 服务令牌。插件必须验证一次性授权码，不能解析框架 Cookie，也不能把服务令牌写进浏览器页面。
