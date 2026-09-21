# auth_qr

使用在线 Android Bot 确认一个已经扫描的 QQ 登录二维码。通常在 [`scan_qr`](/api/scan_qr.html) 返回可确认状态后调用。v2.4.3 的 Linux 免扫登录会在框架内部使用本接口授权同一条 Linux `3.2.32` 二维码；本接口不创建 Linux 会话，也不替代 Linux 侧的最终状态查询。

## 调用

```js
const androidApi = api.forProtocol('android')
const result = await androidApi.auth_qr(123456789, qrK)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行授权动作的在线 Android Bot QQ 号 |
| `k` | string | 是 | 已扫描二维码中的 `k` 参数或完整 URL |
| `skip_phone_confirm` | boolean | 否 | 是否请求跳过手机端二次确认，默认 `false`；QQ 服务端可能忽略 |

## 返回值

返回 `success`、`code`、`message`、目标账号和设备信息。`success: true` 表示 Android 授权请求已受理，最终登录结果由二维码所属的原流程负责确认。

授权接口具有登录影响，不要自动无限重试。账号不一致、二维码过期或 Android Bot 离线时应重新开始完整流程。

v2.4.3 按当前 Android 协议目录的实际 `appid`、`subappid` 与 `magic` 字段组包。调用方不要自行覆盖这些字段；最终账号状态仍应由 `query_login_qr_status` 或原 Linux 登录流程确认。
