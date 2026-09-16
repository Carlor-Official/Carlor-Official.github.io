# nc_get_rkey

`get_rkey` 的另一公开 action，参数和返回值完全一致，并复用同一套萌卡 NT 媒体密钥缓存。

## 调用

```js
const keys = await api.nc_get_rkey(self_id)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |

详见 [get_rkey](/api/get_rkey.html)。
