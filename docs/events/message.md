# 消息事件

v2.0.6修复了两处引用链路问题：群聊/好友发送入口未接入原生引用构造器，以及私聊接收解析遗漏原生引用段。引用事件保留实际收到的作者、原文和时间；发送接口成功不能替代对接收事件的检查。引用段内的 `message_id` 目前可能为空，不应将其当作可操作的消息标识；回复当前这条消息时使用事件顶层的 `message_id`。

## 收到群聊消息

```js
api.on('group_message_received', event => {
  console.log(event.group_name, event.sender.nickname)
  console.log(event.message)
})
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `post_type` | string | `group_message` |
| `group_id` | number | 群号 |
| `group_name` | string | 群名称，无法取得时省略 |
| `msg` | object | 原生消息标识 |
| `message_id` | number | 当前账号范围内的公共消息标识，用于引用、撤回等操作 |
| `sender` | object | 发送者资料 |
| `message` | Segment[] | 结构化消息段 |
| `alt_message` | string | 可阅读的消息摘要 |
| `source` | string | 插件发送来源，接收消息时通常省略 |

## 收到好友消息

```js
api.on('private_message_received', event => {
  console.log(event.sender.user_id, event.alt_message)
})
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `post_type` | string | `friend_message` |
| `msg` | object | 原生消息标识 |
| `message_id` | number | 当前账号范围内的公共消息标识，不是 `msg.seq` |
| `sender` | object | 发送者资料 |
| `receiver` | object | 接收者资料 |
| `message` | Segment[] | 结构化消息段 |
| `alt_message` | string | 可阅读的消息摘要 |
| `source` | string | 插件发送来源，接收消息时通常省略 |

## 消息发送确认

插件通过框架发送消息时，QQ 的原生自身消息回推会与框架保存的发送标识匹配。私聊使用账号、客户端消息序号及随机标识；群聊在发送前按账号、群号和随机标识登记来源，收到发送响应后再校验服务器序号，避免先到的回推丢失来源。匹配成功时，事件的 `event_type` 为 `message_sent`，并在 `source` 中给出发起发送的插件名。其他人发来的消息不会因此被归类为发送确认。

私聊同步使用客户端序号，可能早于发送接口响应到达；框架在发起发送前登记该标识。发送响应中的服务器序号与同步回推中的 `msg.seq` 不保证相等。后续引用消息应使用框架返回的 `message_id`，不要自行将两种序号混用。

v2.0.6将同一账号自己发送的私聊同步与发送响应关联到同一个 `message_id`，保留服务器确认的序号，重复或晚到的回推不会覆盖它。可以使用同步事件中的 `self_id`、`client_type`、`message_id` 调用 `delete_msg`；若回推早于发送确认，撤回最多等待两秒的本地确认，不重新发送消息或补查历史。未获得确认时返回明确错误，不猜测序号；不能通过此接口撤回其他人发送的私聊消息。此说明不保证外部客户端发出的消息都有框架本地发送确认。

```js
api.on('message_sent', event => {
  console.log(event.source, event.msg.seq, event.msg.random)
})
```

这不是接口调用成功的替代品：接口结果表示 QQ 已接受发送请求，`message_sent` 表示框架收到了可匹配的原生自身消息回推，两者不保证先后顺序。框架不会根据接口成功响应伪造事件。多协议登录时，同步可能出现在同一 QQ 的另一个已登录协议上，事件的 `client_type` 表示实际收到回推的协议。没有原生回推或发送标记已过期时，不保证产生发送确认事件。

## 消息标识

```js
{
  uid: 0,
  seq: 123,
  random: 456,
  time: 1710000000,
}
```

`seq`、`random` 是原生消息标识。只有明确要求原生序号的接口才传这些字段；`delete_msg`、引用回复等要求公共 `message_id` 的接口使用事件顶层标识，不能用 `seq` 替代。标识只能用于对应的账号和协议。

## 发送者

```js
{
  user_id: 123456789,
  nickname: '昵称',
  card: '群名片',
  role: 0,
  title: '头衔',
  level: 1,
}
```

好友消息不包含群资料。群消息中的 `card`、`role`、`title` 和 `level` 只在原生推送提供时出现。

## 消息段

消息段统一使用：

```js
{ type: 'text', data: { text: '你好' } }
```

完整类型见[消息段](/reference/message-segments.html#接收消息段)。

图片的 `file_id` 与尺寸标识资源，下载 URL 内的临时 `rkey` 可能因协议会话或凭据刷新而不同。不要将整条 URL 当作永久消息身份；引用或撤回时使用事件顶层的 `message_id`。撤回事件的缓存原文可能保留同一 QQ 另一协议实际收到的图片 URL。
