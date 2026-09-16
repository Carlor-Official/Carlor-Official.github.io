# _del_group_notice

删除指定群聊中的公告。接口沿用当前 QQ Android 9.2.70 登录态访问 QQ 官方群公告接口，不依赖 PC QQ 能力。

```js
await api._del_group_notice({
  self_id: 1060221,
  group_id: 123456789,
  notice_id: "公告 ID",
})
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行请求的 QQ 账号 |
| `group_id` | number | 是 | 群号 |
| `notice_id` | string | 是 | `_get_group_notice` 返回的 `notice_id` |

成功时返回空数据。账号必须拥有删除该公告的管理权限；QQ 返回权限或登录态错误时，框架会保留错误码和提示，不会误报成功。
