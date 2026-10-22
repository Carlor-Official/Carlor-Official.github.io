# API 参考

通过已认证的 WebSocket 服务调用接口。Node.js SDK 的正向与反向连接使用相同方法；成功时 Promise 返回业务数据，失败时抛出异常。

## 调用方式

```js
const androidApi = api.forProtocol('android')
const linuxApi = api.forProtocol('linuxqq')
const info = await androidApi.get_login_info(self_id)
```

账号接口使用 `self_id` 指定 QQ。`client_type` 取 `android` 或 `linuxqq`；SDK 未设置协议作用域时默认 Android。服务管理接口是否需要账号参数，以各接口参数表为准。

### WebSocket 请求

```json
{
  "type": "action",
  "id": "request-1",
  "action": "get_login_info",
  "params": { "self_id": 123456789, "client_type": "android" }
}
```

### 成功响应

```json
{
  "type": "action_result",
  "id": "request-1",
  "ok": true,
  "data": { "user_id": 123456789, "nickname": "示例账号", "client_type": "android" }
}
```

### 错误响应

```json
{
  "type": "action_result",
  "id": "request-1",
  "ok": false,
  "error": "账号未在线"
}
```

各接口的返回说明对应 `data`。流式接口通过回调接收分片，详见 [download_file_stream](/api/download_file_stream.html)。连接与认证见 [SDK 接入](/development/nodejs-sdk.html)，推送格式见 [事件参考](/events/)。
