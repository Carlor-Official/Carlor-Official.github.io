# 反向 WebSocket

反向模式下，外部服务监听 WebSocket 地址，萌卡 NT 作为客户端主动连接。这个入口在管理后台的「插件 → 插件对接」中创建。

## 启动外部服务

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
await api.waitForConnection()
```

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | 否 | `0.0.0.0` | 外部服务监听地址 |
| `port` | 否 | `3002` | 外部服务监听端口 |
| `path` | 否 | `/` | WebSocket 路径 |
| `token` | 是 | 无 | 与框架后台一致的服务令牌 |

## 后台配置

点击「添加服务」，选择「反向 WS」，填写：

| 字段 | 示例 | 说明 |
| --- | --- | --- |
| WebSocket 地址 | `ws://127.0.0.1:3002/` | 必须使用 `ws://` 或 `wss://` |
| 服务令牌 | `TOKEN` | 与外部服务配置一致 |
| 重连间隔 | `5` | 取值 1 到 300 秒 |
| 管理端地址 | `http://127.0.0.1:8088` | 可选，只用于管理入口和 SSO |

萌卡 NT 会在断线后按重连间隔再次连接。反向 SDK 同一时间只接受一个框架连接。

## 连接认证

萌卡 NT 发起握手时携带：

| 请求头 | 内容 |
| --- | --- |
| `Authorization` | `Bearer TOKEN` |
| `X-Mengka-Token` | 服务令牌 |
| `X-Mengka-Service` | 服务名称 |

SDK 校验令牌后接受连接，随后框架发送：

```json
{
  "type": "ready",
  "service": "service-name",
  "mode": "reverse"
}
```

插件服务不携带服务级 `node_id`。API 和事件帧格式与正向模式一致，反向连接不会绕过 action 授权。

## 等待与关闭

`waitForConnection(timeoutMs)` 在收到 `ready` 帧后返回。传入 `0` 或省略参数时不设置等待超时。停止服务时调用 `await api.close()`。
