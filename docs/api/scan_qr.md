# scan_qr

使用在线 Android Bot 识别一个 QQ 登录二维码。本接口由 Android 会话执行，不负责创建或查询 Linux 登录会话。v2.4.3 的 Linux 免扫登录会在框架内部使用本接口扫描同一条 Linux `3.2.32` 二维码；插件不需要自行编排免扫流程。

## 调用

```js
const androidApi = api.forProtocol('android')
const result = await androidApi.scan_qr(123456789, qrK)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行扫码动作的在线 Android Bot QQ 号 |
| `k` | string | 是 | 二维码中的 `k` 参数或包含 `k` 的完整 URL |

## 返回值

返回 QQ 的扫码结果，包括 `code`、`message`、`status`、设备名称和客户端信息。服务端提示可确认时，再调用 [`auth_qr`](/api/auth_qr.html)。

不要传 `client_type: 'linuxqq'`。本接口不要自动高频重试：收到明确失败或二维码过期后，应停止当前流程并由用户重新获取二维码。

## 协议字段

v2.4.3 按当前 Android 协议目录的实际 `appid`、`subappid` 与 `magic` 字段组包，并保持 Linux `3.2.32` 二维码会话参数不变。调用方不要自行替换 AppID、拼装扫码包或借用其他版本字段。

扫码成功仍需继续授权并查询原 Linux 登录流程的最终状态，不能仅凭 `code: 0` 宣称 Linux 已上线。
