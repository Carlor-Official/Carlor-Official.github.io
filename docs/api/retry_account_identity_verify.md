# retry_account_identity_verify

在身份验证完成后使用验证参数重试登录。

## 调用

```js
const result = await api.retry_account_identity_verify({
  self_id,
  client_type: 'android',
  login_type: 2,
  extra: { verify_sign }
})
```

`login_type` 与 `extra` 必须来自当前登录会话的验证结果。成功返回 Bot 信息；业务失败返回 `code`、`message` 与 `extra_info`，传输或权限失败会抛出错误。
