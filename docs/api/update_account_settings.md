# update_account_settings

更新框架级账号运行设置。只提交需要修改的字段即可。

## 调用

```js
const settings = await api.update_account_settings({
  cacheLogin: true,
  autoLogin: true,
  privacyMode: false,
  silentMode: false,
  autoDeleteOffline: true,
  autoDeleteOfflineMinutes: 60
})
```

`autoDeleteOfflineMinutes` 范围为 1–10080。开启 `autoLogin` 前必须开启 `cacheLogin`；关闭缓存登录会同时关闭自动登录。成功返回保存后的完整设置。
