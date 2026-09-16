# like_summary_card

点赞指定用户的 QQ 名片。

::: tip 适用协议
v2.0.6支持 Android 与 Linux QQ；Linux 使用当前账号的原生点赞服务。v2.0.5 的 Linux 旧链路可能返回业务错误码 151。
:::

## 调用

```js
const result = await api.like_summary_card(
  self_id,
  target_uin,
  like_count,
)
const linuxResult = await api.forProtocol('linuxqq').like_summary_card(self_id, target_uin, 1)
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `self_id` | number | 是 | - | 在线 Bot QQ 号 |
| `target_uin` | number | 是 | - | 目标 QQ 号 |
| `like_count` | number | 否 | `1` | 点赞次数 |
| `client_type` | string | 否 | `android` | WS 请求字段；SDK 通过 `forProtocol('linuxqq')` 指定，多协议账号应明确协议 |

## 返回值

```js
{ code: 0, msg: '成功' }
```

`code` 和 `msg` 来自 QQ 名片点赞响应。

仅 `code === 0` 表示操作成功；额度、风控和服务端拒绝仍按实际结果返回。Linux 需要解析目标原生 UID，无法确认身份时明确失败，不用 QQ 数字冒充 UID。点赞成功不会由框架伪造 `profile_liked`；请在目标账号订阅原生事件另行确认。
