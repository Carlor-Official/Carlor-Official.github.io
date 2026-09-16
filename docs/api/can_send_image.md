# can_send_image

检查当前在线 Bot 是否具备图片发送能力。

## 调用

```js
const result = await api.can_send_image(self_id)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |

## 返回值

```js
{ yes: true }
```

使用 `api.forProtocol('android' | 'linuxqq')` 选择账号协议，框架按账号实际节点路由并检查在线状态。v2.0.6 此能力标志仍对 Android 返回 `true`、Linux 返回 `false`，并非逐种消息场景的探测结果。

注意：Linux 群图片发送链路已在 v2.0.6 修复并实测，但此标志尚未同步，不能把 `false` 解释为所有 Linux 图片接口都不支持。接入方应结合具体发送接口的协议说明及实际结果判断；好友图片上传全链路未包含在已完成的实测范围内。
