# get_pskey

获取指定域名的 PsKey。

> v2.0.6补充 Linux 原生域名凭据获取。请显式选择账号协议；不会跨协议借用 Android 登录票据。返回的 `pskey` 是敏感凭据，不应写入日志、前端页面或公开报告。精华查询等已有框架 API 会在内部处理凭据，插件无需自行获取。

## 调用

```js
const result = await api.get_pskey(self_id, domain)
// Linux 账号：使用协议作用域明确选择。
const linuxResult = await api.forProtocol('linuxqq').get_pskey(self_id, 'qun.qq.com')
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |
| `domain` | string | 是 | 目标域名 |
| `client_type` | string | 否 | WS 请求字段；SDK 通过 `forProtocol('linuxqq')` 指定，多协议账号应始终明确协议 |

## 返回值

```js
{
  domain: 'DOMAIN',
  pskey: 'PSKEY',
}
```
