# get_group_msg_history

从 QQ 服务器读取指定群聊的历史消息。该接口使用 Android QQ 9.2.70 的 `MessageSvc.PbGetGroupMsg`，返回的 `message_id` 可以继续用于 `get_msg`、撤回、转发和标记已读。

## 调用示例

```js
const result = await api.get_group_msg_history({
  self_id: 1060221,
  group_id: 123456789,
  message_seq: 0,
  count: 20,
  reverseOrder: false,
})
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行请求的 QQ 账号 |
| `group_id` | number | 是 | 群号 |
| `message_seq` | number | 否 | 分页锚点；传 `0` 从最新消息开始 |
| `count` | number | 否 | 返回数量，默认 `20`，范围 `1-100` |
| `reverseOrder` | boolean | 否 | 是否反转本页消息顺序，默认 `false`；也兼容 `reverse_order` |

v2.0.6 修复（v2.0.6）：`message_seq=0` 先读取服务器最新群消息序号，不依赖本地缓存，也不发送虚构的最大序号。返回的实际消息保存账号范围内的 `message_id`，可继续调用 `get_msg`；服务端已删除且没有发送者、时间的占位记录不作为消息返回。查询历史不会向插件重播消息事件。Android 双节点测试证据与 Linux 验收分开记录。

## 返回值

```json
{
  "messages": [
    {
      "time": 1720000000,
      "self_id": 1060221,
      "post_type": "message",
      "message_type": "group",
      "message_id": 123456,
      "group_id": 123456789,
      "user_id": 106606,
      "message": [{ "type": "text", "data": { "text": "你好" } }],
      "raw_message": "你好"
    }
  ],
  "next_message_seq": 9980,
  "has_more": true
}
```

继续向前翻页时，把上一次返回的 `next_message_seq` 传给 `message_seq`。

该接口是只读查询。Android 使用上述 9.2.70 协议；Linux QQ 使用对应的原生历史消息能力，不会转发到同 QQ 的 Android 实例。
