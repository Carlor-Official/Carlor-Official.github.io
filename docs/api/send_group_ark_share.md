# send_group_ark_share

与 `ArkShareGroup` 使用同一套萌卡 NT 原生群聊分享链路，参数与返回值一致。

## 调用

```js
const ark = await api.send_group_ark_share(self_id, group_id)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |
| `group_id` | number | 是 | 当前账号已加入的群号 |

详见 [ArkShareGroup](/api/ArkShareGroup.html)。
