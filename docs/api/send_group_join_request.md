# send_group_join_request

主动申请加入群聊。v2.0.6 新增；v2.0.5 不支持此接口。

目前仅支持 Android 发起。Linux 调用明确返回 `GROUP_JOIN_PROTOCOL_UNSUPPORTED`，不将 Android 请求套用到 Linux 会话。

## 调用

```js
const result = await api.forProtocol('android').send_group_join_request(
  1060221, 305977791, '申请说明'
)
```

```json
{
  "action": "send_group_join_request",
  "params": {
    "self_id": 1060221,
    "client_type": "android",
    "group_id": 305977791,
    "message": "申请说明"
  }
}
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线账号 QQ，10000 至 4294967295 |
| `client_type` | string | 是 | 当前必须为 `android` |
| `group_id` | number | 是 | 群号，10000 至 4294967295 |
| `message` | string | 否 | 申请说明，默认空；有效 UTF-8，最多 255 字节，不含空字符；不截断文字 |

## 返回

```json
{ "group_id": 305977791, "submitted": true, "status": "submitted", "result": 0 }
```

`result` 保留服务器业务状态。非零时 `submitted: false`、`status: "rejected"`；缺少状态、响应异常和网络失败作为调用错误返回。`submitted` 仅表示提交成功，不代表管理员已同意或账号已经入群。

同一账号对同一群的提交间隔至少 60 秒，包含结果不确定的尝试。框架和 SDK 均不自动重试；超时后先查询群通知和实际成员状态，避免重复申请。验证码、问答、付费等策略没有自动绕过流程。

管理员通过 `group_request_received` 获取本次 `request_id`、`request_type`、`request_extra`，使用该事件的账号和协议调用 `approve_group_apply` 或 `reject_group_apply`。申请和成员事件以真实 QQ 数据为准，不因提交/审批成功直接生成。

## 验证范围

两个测试账号互换申请者和群主，已完成 Android 主动申请、群主 Android/Linux 接收、跨协议拒绝与同意、再次申请采用新编号、四会话成员关系确认及双正向/单反向 WS 投递验证。拒绝没有产生虚假加入事件；批准后群主和申请者均收到原生加入通知。Linux 主动提交是不支持的能力，不是等待开启的选项；邀请待审批等其他流程未包含在本次实测范围内。
