# scan_qr

使用在线 Android Bot 识别一个 QQ 登录二维码。本接口是 Android 会话能力，不属于 Linux 原生账号管理链路。

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

## v2.0.6 修复

v2.0.6 修复平板扫码的 `-10117`（AppID 无效）：读取同版本 Phone 协议的 `appid`，不把 `subappid` 当作 AppID，也不借用其他版本。协议目录必须保留相同 `ver` 的 Phone 项，缺少时明确报错。

该修复已通过两个 Android 平板测试账号授权各自 Linux 登录的完整流程验证；已发布 v2.0.5 尚不包含此修复。扫码成功仍需继续授权并查询原登录流程的最终状态，不能仅凭 `code: 0` 宣称 Linux 已上线。
