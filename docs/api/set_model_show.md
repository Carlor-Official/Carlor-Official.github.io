# set_model_show

设置当前 QQ 账号的在线机型显示名称。接口由萌卡 NT 原生后端使用账号会话和设备指纹调用 QQ 服务，不依赖其他机器人框架。

```js
await api.set_model_show(1060221, 'Xiaomi 14 Pro', 'Xiaomi 14 Pro')
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 要设置的在线 Bot QQ 号 |
| `model` | string | 否 | 手机型号；未填写时使用账号绑定指纹中的型号 |
| `model_show` | string | 否 | 要显示的机型名称；传空字符串时恢复 QQ 默认显示 |

建议先调用 `get_model_show` 获取当前账号可用的显示名称，再选择 `need_pay=false` 或账号已具备权益的项目。成功时返回空数据。

该操作仅修改 QQ 展示机型，不修改框架设备指纹；传入空 `model_show` 可恢复 QQ 默认显示。插件统一使用公开 action `set_model_show`。
