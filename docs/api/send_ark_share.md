# send_ark_share

与 `ArkSharePeer` 使用同一套萌卡 NT 原生联系人分享链路，参数与返回值一致。

## 调用

```js
const result = await api.send_ark_share(self_id, user_id, phone_number)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |
| `user_id` | number | 是 | 当前好友 QQ 号 |
| `phone_number` | string | 否 | 卡片中显示的手机号 |

详见 [ArkSharePeer](/api/ArkSharePeer.html)。
