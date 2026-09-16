# Bot 登录流程

登录 API 使用 `self_id + client_type` 找到协议账号，并在账号自己的登录节点上执行。发起登录前，账号必须已经创建且处于离线状态；同一 QQ 同时存在 Android 与 Linux QQ 时必须传入正确的 `client_type`。

以下示例中的 `self_id` 是要登录的 Bot QQ 号：

```js
const self_id = 123456789
```

也可以从 `get_bot_list()` 返回项的 `self_id` 取得：

```js
const bots = await api.get_bot_list()
const self_id = bots[0].self_id
```

## 登录前检查

```js
const bots = await api.get_bot_list()
const bot = bots.find(item => item.self_id === self_id && item.client_type === 'android')

if (bot && bot.status !== 0) {
  await api.stop_account_login(self_id, 'android')
}
```

## 密码登录

添加账号不自动登录。用户明确发起登录后，先检查缓存并尝试缓存登录；仅在缓存明确失效时转入对应协议的普通登录。网络超时不是缓存失效，不自动反复提交登录或安全验证。

```js
const result = await api.login_account(self_id)
```

返回基础结构：

```js
{ code: Number, message: String }
```

常见状态：

| `code` | 含义 | 后续操作 |
| --- | --- | --- |
| `0` | 登录成功 | 开始使用该 Bot |
| `140022008` | 需要滑块验证 | 展示 `slider_url`，完成后调用 `submit_slider` |
| `140022007` | 需要身份验证 | 使用 `identity_url` 及账号协议、设备指纹完成验证 |
| `140022010` | 需要安全验证 | 查询<a class="security-method-link" href="/api/get_security_verify_methods">安全验证方式</a>，按可用方式继续 |
| `140022013` | 账号或密码错误 | 检查账号配置 |

`security_url` 仅在响应实际包含地址时出现，不应假定该字段始终存在。

## 滑块验证

```js
const result = await api.submit_slider(self_id, ticket, randstr)
```

| 参数 | 说明 |
| --- | --- |
| `self_id` | QQ 号 |
| `ticket` | 滑块完成后返回的 ticket |
| `randstr` | 滑块完成后返回的 randstr |

返回结构与 `login_account` 一致。如果返回另一种验证状态，继续按新的 `code` 处理。

## 安全验证

安全验证可通过 `security_verify` 判断当前可用方式，也可以调用 `get_security_verify_methods` 重新查询。根据返回的 `methods` 选择扫码、短信或其他验证方式。

### 扫码安全验证

当结果为 `140022010` 时，可使用响应中的 `security_verify`，也可以重新查询当前验证原因和可用方式：

```js
const securityVerify = await api.get_security_verify_methods(self_id)
```

当 `securityVerify.methods` 包含扫码方式时，创建登录二维码：

```js
const qr = await api.create_login_qr(self_id)
// 将 qr.qr_url 渲染为二维码
```

使用返回的 `guarantee_token` 每秒查询一次状态：

```js
const result = await api.query_login_qr_status(
  self_id,
  qr.guarantee_token,
)
```

`status` 依次可能为 `waiting`、`scanned`、`confirmed` 或 `expired`。当状态为 `confirmed` 时，服务端会自动继续 NTLogin，当前响应的 `code` 与 `message` 即最终登录结果，应停止轮询。

### 短信安全验证

当结果为 `140022010` 且 `security_verify.methods.verify_list` 包含短信方式时，用该方式的 `sign` 请求短信验证。短信验证有两种类型，由 `verify_type` 指定，必填：

| `verify_type` | 名称 | 说明 |
| --- | --- | --- |
| `4` | 接收短信 | 服务端向密保手机下发验证码 |
| `3` | 发送短信 | 用户用密保手机把指定内容发送到指定号码 |

#### 接收短信（verify_type 4）

```js
const sms = await api.get_sms(self_id, 4, sign)
```

返回服务端原始响应：

```js
{ result: { state: 1, code: 1 }, sign: 'NEW_SMS_SIGN', masked_phone: '166******00', country_code: '86' }
```

提交时必须使用这里**新返回**的 `sign`：

```js
const result = await api.check_sms(self_id, 4, sms.sign, code)
```

#### 发送短信（verify_type 3）

```js
const sms = await api.get_sms(self_id, 3, sign)
```

返回里多出 `sms`（短信内容）和 `send_to`（接收号码）：

```js
{ result: { state: 1, code: 1 }, sign: 'NEW_SMS_SIGN', sms: '验证QQ',
  send_to: '10690700511', masked_phone: '166******00', country_code: '86' }
```

引导用户用密保手机把 `sms` 的内容原样发送到 `send_to`，发送后回查，不需要传 `code`：

```js
const result = await api.check_sms(self_id, 3, sms.sign)
```

#### 结果处理

两种类型一致：校验通过后服务端自动继续 NTLogin Type 2，返回结构与 `login_account` 一致；校验未通过则返回 `CheckSMS` 的原始响应，`result.prompt` 是原因，登录会话保留，可以用同一个 `sign` 重试。

## 身份验证所需数据

身份验证流程可能需要账号当前使用的协议与设备指纹：

```js
const bots = await api.get_bot_list()
const bot = bots.find(item => item.self_id === self_id && item.client_type === 'android')

const protocols = await api.get_protocol_list()
const protocol = protocols[bot.protocol_id]

const profiles = await api.get_device_profile_list()
const deviceProfile = profiles.find(
  item => item.id === bot.device_profile_id,
)
```

## 缓存登录

先检查缓存：

```js
const cache = await api.check_cache(self_id)
// { valid: true | false }
```

缓存有效时：

```js
const result = await api.cache_login(self_id)
```

成功：

```js
{ code: 0, message: '登录成功' }
```

失败时可能返回：

```js
{ code: 1, message: '...', cache_invalid: true }
```

`cache_invalid` 为 `true` 时，改用 `login_account`。

## Linux 登录

使用 `const linux = api.forProtocol('linuxqq')`，通过 `linux.check_cache(self_id)`、`linux.cache_login(self_id)` 检查并恢复缓存。缓存明确失效时，由 `linux.login_account(self_id)` 启动原生二维码登录，再用 `linux.query_login_qr_status` 按返回凭据查询；失效后用 `linux.create_login_qr` 刷新。二维码参数见对应 API，不能混用 Android 安全验证的 `guarantee_token`。

在线 Android 账号的 `scan_qr` / `auth_qr` 可扫描并授权该登录二维码，但它们不是 Linux 创建二维码的接口。扫码授权成功后仍需查询原登录会话，确认最终上线。停止使用 `linux.stop_account_login(self_id)`，不会删除账号或缓存。


## Linux 免扫登录（v2.1.0）

账号页点击 Linux 账号的“登录”后，先选择“免扫登录”或“扫码登录”。同 QQ 的安卓协议账号已经登录时，免扫登录可用；没有在线安卓会话时按钮禁用，只能人工扫码。登录途中遇到手机确认或风控时，按返回提示处理。

免扫登录复用现有协议接口：Linux 的 `wtlogin_trans_emp` 取得二维码，在线安卓账号调用 `scan_qr` 和 `auth_qr` 完成授权，再由 Linux 查询并完成二维码登录。授权接口以安卓账号调用，不能把 Linux 的 `client_type` 传给安卓授权接口。不要并发发起多次登录或在失败后无限自动重放。

等级任务的“电脑QQ在线”已由框架封装这条流程，插件通过 `execute_level_task_selection` 执行即可，不需要另外实现登录循环。登录建立与 QQ 累计在线时长是两个阶段。
