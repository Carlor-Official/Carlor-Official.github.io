# set_group_new_member_history_visibility

设置新加入群聊的成员是否可以查看入群前的历史消息。接口使用 Android QQ 9.2.70 的群设置链路，并在提交后回读校验。

```js
const result = await api.set_group_new_member_history_visibility({
  self_id: 1060221,
  group_id: 123456789,
  visible: true,
})
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行请求的 QQ 账号 |
| `group_id` | number | 是 | 群号 |
| `visible` | boolean | 是 | 是否允许新成员查看历史消息；也兼容字段名 `enable` |

成功时返回群号、当前可见状态、底层群标志位以及 `read_back_verified: true`。
