# 反向 WebSocket

反向模式下，插件监听 WebSocket 地址，萌卡NT作为客户端主动连接。

## 启动插件服务

```js
import { createReverseAPI } from './reverse-sdk.js'

const api = createReverseAPI({
  host: '0.0.0.0',
  port: 3002,
  path: '/',
  token: 'TOKEN',
})

api.on('group_message', event => {
  console.log(event.group_id, event.alt_message)
})

await api.listen()

const connection = await api.waitForConnection()
console.log(connection.service, connection.mode)
```

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | 否 | `0.0.0.0` | 插件监听地址 |
| `port` | 否 | `3002` | 插件监听端口 |
| `path` | 否 | `/` | WebSocket 路径 |
| `token` | 是 | - | 与管理后台一致的服务令牌 |

## 后台配置

在插件服务中选择“反向 WS”，填写：

| 字段 | 示例 | 说明 |
| --- | --- | --- |
| WebSocket 地址 | `ws://127.0.0.1:3002/` | 必须使用 `ws://` 或 `wss://` |
| 服务令牌 | `TOKEN` | 与插件 SDK 配置一致 |
| 重连间隔 | `5` | 取值 1 到 300 秒 |

萌卡NT会在断线后按重连间隔再次连接。反向 SDK 同一时间只接受一个萌卡NT连接。

## 等待与关闭

```js
await api.listen()
await api.waitForConnection(15_000)

console.log(api.connected)

await api.close()
```

`waitForConnection(timeoutMs)` 在收到萌卡NT的 `ready` 帧后返回。传入 `0` 或省略参数时不设置等待超时。

## 连接认证

萌卡NT发起握手时会携带以下请求头：

| 请求头 | 内容 |
| --- | --- |
| `Authorization` | `Bearer TOKEN` |
| `X-Mengka-Token` | 服务令牌 |
| `X-Mengka-Service` | 服务名称 |

SDK校验令牌后接受连接。随后萌卡NT发送：

```json
{
  "type": "ready",
  "service": "service-name",
  "mode": "reverse"
}
```

插件服务不再携带或返回服务级 `node_id`。普通账号 action 由框架按照 `self_id + client_type` 路由到账号自己的登录节点；反向连接的事件范围由服务事件权限决定。

手工创建的反向服务按照连接声明的事件权限接收事件。市场服务只接收开发者在官网选择、审核并在安装时冻结的事件；安装包不参与权限判断，也不能自行扩大授权。API 和事件帧格式与正向模式一致，不会因反向连接而绕过 action 授权。

托管进程、官网权限快照、可选运行描述、配置文件和安全令牌规则见[插件托管与权限协议](/reference/plugin-extension-v2.html)。
