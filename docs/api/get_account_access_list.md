# get_account_access_list

获取当前插件服务创建的账号授权租约。不会读取其他插件服务的租约。

## 调用

```js
const all = await api.get_account_access_list()
const oneQQ = await api.get_account_access_list({ self_id })
```

每项包含 `service_id`、`self_id`、`platform`、`owner_id`、`enabled`、`expires_at`、`metadata`、`updated_at` 和 `created_at`。`platform` 为 `android` 或 `linux`。

同一 QQ 的 Android 与 Linux 是两条独立租约。列表可用于插件断线恢复后的周期对账。
