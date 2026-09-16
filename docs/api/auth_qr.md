# auth_qr

使用在线 Android Bot 确认一个已经扫描的 QQ 登录二维码。通常在 [`scan_qr`](/api/scan_qr.html) 返回可确认状态后调用；本接口不属于 Linux 原生账号管理链路。

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

v2.0.6同步修复平板协议扫码授权的 AppID 字段选择，使用同版本 Phone 项的 `appid`。两名测试账号均已完成扫码、授权、Linux 确认上线及双 WS 上线事件验证；最终账号状态仍应由 `query_login_qr_status` 或原登录流程确认。
