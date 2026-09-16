# get_model_show

获取当前 QQ 账号与设备型号可用的在线机型显示名称。接口由萌卡 NT 后端直接使用当前账号的 Android 9.2.70 登录态、设备指纹和 QQ 会员机型服务完成。

```js
const result = await api.get_model_show(1060221, 'Xiaomi 14 Pro')
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 要查询的在线 Bot QQ 号 |
| `model` | string | 否 | 手机型号；未填写时使用账号绑定指纹中的型号 |

成功时返回：

```json
{
  "variants": [
    {
      "model_show": "Xiaomi 14 Pro",
      "need_pay": false
    }
  ]
}
```

`need_pay` 表示该显示名称是否要求 QQ 会员权益。查询结果来自 QQ 服务端，不使用固定占位数据。

该接口复用框架现有 PsKey 能力后请求 QQ 会员 Web 服务，不增加新的 MSF/OIDB 命令。插件统一使用公开 action `get_model_show`。
