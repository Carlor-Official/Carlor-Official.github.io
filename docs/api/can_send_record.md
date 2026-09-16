# can_send_record

检查当前在线 Bot 是否具备语音发送能力。

## 调用

```js
const result = await api.can_send_record(self_id)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |

## 返回值

```js
{ yes: true }
```

使用 `api.forProtocol('android' | 'linuxqq')` 选择账号协议，框架按账号实际节点路由并检查在线状态。v2.0.6 此能力标志对 Android 返回 `true`、Linux 返回 `false`。这是框架本地能力标志，不会发出测试语音，也不是任意语音编码、上传或转换流程的成功保证。
