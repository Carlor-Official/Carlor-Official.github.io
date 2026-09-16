# 消息段

## send_group_msg

```js
const result = await api.send_group_msg(self_id, group_id, message)
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `self_id` | number | 在线 Bot QQ 号 |
| `group_id` | number | 目标群聊 ID |
| `message` | Segment[] | 消息段数组 |

成功返回：

```js
{ success: true, message_id: 123456789, msg_seq: 123, msg_random: 456 }
```

`msg_seq` 与 `msg_random` 可用于 [`recall_group_msg`](/api/recall_group_msg.html)。

## send_friend_msg

```js
const result = await api.send_friend_msg(self_id, user_id, message)
```

好友消息支持 `text`、`reply`、`image` 和 QQ 原生 `face` 段。成功返回结构与群聊消息一致。

## send_group_temp_msg

```js
const result = await api.send_group_temp_msg(self_id, group_id, user_id, message)
```

通过共同群聊向群成员发送 QQ 原生临时会话，双方无需互为好友。消息支持 `text`、`reply`、`image` 和 QQ 原生 `face` 段；引用消息必须来自同一来源群、同一成员会话。

## 发送消息段

### text

```js
{ type: 'text', data: { text: '你好' } }
```

文本原生支持 Unicode emoji，不需要转义或转换编码：

```js
{ type: 'text', data: { text: '完成啦 🎉😂❤️' } }
```

文本中也可以使用框架统一的 QQ 表情简写 `[bq<表情ID>]`。例如 `[bq190]` 会发送 QQ 自带的 190 号表情，且可以与文字、emoji 混合：

```js
{ type: 'text', data: { text: '🎉 综合娱乐插件 [bq190] 已启动 😂' } }
```

兼容识别 `[bq:190]`、`[qqface:190]` 和 `[CQ:face,id=190]`。需要原样发送代码时，在左方括号前加反斜杠：`\[bq190]`。

### reply

v2.0.6 已修复群聊/好友发送错误拒绝 `reply` 和好友接收遗漏引用段的问题；v2.0.5 不含此修复。群/好友引用已真实验证，群临时会话本地缓存及会话隔离有回归测试，但非好友临时会话引用没有完成真实全链路验证。

群聊、好友消息和群临时会话均支持 QQ 原生引用回复。`message_id` 来自收到的消息事件、消息历史接口，或对应发送接口的返回值：

```js
{ type: 'reply', data: { message_id: 123456789 } }
```

完整示例：

```js
await api.send_group_msg(self_id, group_id, [
  { type: 'reply', data: { message_id: event.message_id } },
  { type: 'text', data: { text: '这是引用回复正文' } },
])
```

OneBot 兼容接口 `send_msg` / `send_private_msg` 也接受 `{ type: 'reply', data: { id: 123456789 } }`。框架会校验引用消息属于当前账号和当前会话，防止跨群或跨好友引用；一条消息只能有一个 `reply` 段，并且还需要至少一个正文消息段。

### at

仅用于群聊消息。`uin` 使用字符串；`all` 表示全体成员。

```js
{ type: 'at', data: { uin: '123456789' } }
{ type: 'at', data: { uin: 'all' } }
```

### image

```js
{ type: 'image', data: { file_id: 'FILE_ID' } }
```

`file_id` 可来自收到的群聊图片，但缓存时间有限；更稳定的方式是先调用 `upload_group_image`。

### voice

```js
{ type: 'voice', data: { file_id: 'FILE_ID' } }
```

语音段应使用 `upload_group_voice` 的返回值，且只能发送到上传时指定的群。

### video

```js
{ type: 'video', data: { file_id: 'FILE_ID' } }
```

视频段应使用 `upload_group_video` 的返回值，并作为一条独立消息发送。

### face

QQ 原生表情：

```js
{
  type: 'face',
  data: {
    kind: 'qq_face',
    face_id: '14'
  }
}
```

结构化 `face` 是插件需要精确控制消息段时的标准格式，群聊和好友消息均可使用。`face_code` 为可选的十六进制原始表情码。资源表情使用 `kind: 'super_face'`，并按收到的 `face` 消息段传递 `type`、`category_id`、`face_id`、`package_id` 和 `text`；`super_face` 当前仅支持群聊。

## upload_group_image

```js
const image = await api.upload_group_image(
  self_id,
  group_id,
  file_path,
)

await api.send_group_msg(self_id, group_id, [image])
```

`file_path` 支持本地路径、`file://` 和 `http://`/`https://` 地址。文件名和图片类型由后端自动生成。返回值可直接作为消息段使用：

```js
{ type: 'image', data: { file_id: 'FILE_ID' } }
```

## upload_friend_image

```js
const image = await api.upload_friend_image(
  self_id,
  user_id,
  file_path,
)

await api.send_friend_msg(self_id, user_id, [image])
```

好友图片的文件名和图片类型由后端自动生成，返回值可直接作为好友消息段使用。

## upload_group_voice

```js
const voice = await api.upload_group_voice(self_id, group_id, file_path)
await api.send_group_msg(self_id, group_id, [voice])
```

输入可以是 FFmpeg 可解码的常见音频格式。后端会负责转码并生成波形，返回值可直接作为 `voice` 消息段使用。

## upload_group_video

```js
const video = await api.upload_group_video(self_id, group_id, file_path)
await api.send_group_msg(self_id, group_id, [video])
```

输入文件必须为 MP4 格式。后端使用 FFmpeg 镜像读取视频信息并生成封面，返回值可直接作为 `video` 消息段使用。

## 合并转发

读取收到的合并转发消息：

```js
const result = await api.get_group_forward_msg(self_id, sender_uin, res_id)
// { res_id, messages }
```

创建仅包含文本的合并转发消息：

```js
const result = await api.send_group_forward_msg(self_id, group_id, [
  {
    user_id: 123456789,
    nickname: '示例用户',
    time: Math.floor(Date.now() / 1000),
    message: [{ type: 'text', data: { text: '第一条消息' } }],
  },
])

await api.send_group_msg(self_id, group_id, result.message)
```

`time` 为 Unix 秒。非 `text` 消息段会被忽略，返回值包含已上传和被忽略的数量。

## 接收消息段

消息事件的 `message` 数组可能包含：

| 类型 | 常用数据字段 |
| --- | --- |
| `text` | `text` |
| `image` | `file_id`, `url`, `width`, `height` |
| `voice` | `file_id`, `url`, `duration` |
| `video` | `file_id`, `url`, `name`, `size`, `width`, `height`, `duration` |
| `mention` | `user_id`, `display` |
| `mention_all` | 空对象 |
| `reply` | `message_id`, `user_id`, `text`, `time` |
| `recall` | 操作者、消息标识和可选原消息 |
| `ark` | Ark 卡片字段 |
| `face` | `kind`, `type`, `face_id`, `text` 等；QQ 原生表情的 `text` 为 `[bq<表情ID>]` |
| `red_packet` | `title`, `listid`, `authkey`, `channel`, `pay_flag`, `hb_from` |

发送段与接收段的类型并非完全对称。例如发送群 @ 使用 `at` 和 `uin`，接收时使用 `mention` 和 `user_id`。
