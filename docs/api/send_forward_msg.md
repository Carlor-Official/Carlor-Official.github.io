# send_forward_msg

萌卡 NT 通用合并转发接口。填写 `user_id` 时发送给好友，填写
`group_id` 时发送到群聊；两个目标参数必须且只能填写一个。

## 私聊示例

```js
const result = await api.send_forward_msg({
  self_id,
  user_id: 123456789,
  messages: [{
    type: 'node',
    data: {
      user_id: 123456789,
      nickname: '示例用户',
      content: '这是一条合并转发内容',
    },
  }],
})
```

## 群聊示例

```js
const result = await api.send_forward_msg({
  self_id,
  group_id: 123456789,
  messages,
})
```

节点结构、消息引用、返回字段与
[send_private_forward_msg](/api/send_private_forward_msg.html) 和
[send_group_forward_msg](/api/send_group_forward_msg.html) 一致。
