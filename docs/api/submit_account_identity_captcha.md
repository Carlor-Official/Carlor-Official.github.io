# submit_account_identity_captcha

向指定账号的身份验证流程提交滑块结果。

## 调用

```js
const result = await api.submit_account_identity_captcha(
  self_id,
  ticket,
  randstr,
  'android'
)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 目标 QQ |
| `ticket` | string | 是 | 滑块验证票据 |
| `randstr` | string | 是 | 滑块随机串 |
| `protocol` | string | 否 | `android` 或 `linux`，默认 `android` |

`ticket` 与 `randstr` 必须来自当前账号同一次验证会话。过期或跨会话复用会被拒绝。
