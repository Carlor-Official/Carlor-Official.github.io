# retry_account_security_verify

在安全验证完成后使用验证参数重试登录。

## 调用

```js
const result = await api.retry_account_security_verify({
  self_id,
  client_type: 'android',
  login_type: 2,
  extra: { verify_sign }
})
```

该接口与 `retry_account_identity_verify` 使用同一重试契约，仅用于不同的前端验证阶段。成功返回 Bot 信息；业务失败返回 `code`、`message` 与 `extra_info`。
