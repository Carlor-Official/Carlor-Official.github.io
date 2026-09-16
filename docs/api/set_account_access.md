# set_account_access

创建或更新当前插件服务对指定 QQ 与协议的授权租约。

## 调用

```js
const lease = await api.set_account_access({
  self_id,
  client_type: 'linuxqq',
  owner_id: 'plugin-user-42',
  enabled: true,
  expires_at: '2026-10-01T00:00:00+08:00',
  metadata: { source: 'order', order_id: 'M202609030001' }
})
```

## 规则

- 框架中必须已经存在相同 `self_id` 与协议的账号。
- `enabled` 省略时为 `true`；`expires_at` 可省略表示无到期时间。
- 时间支持 RFC 3339、`YYYY-MM-DD HH:mm:ss` 和 `YYYY-MM-DDTHH:mm:ss`。
- 租约被停用或过期后，框架会阻止重新登录并停止已接管账号；未创建过任何插件租约的普通框架账号不受影响。
- `metadata` 只放追踪标识，不要保存令牌、密码或支付密钥。
