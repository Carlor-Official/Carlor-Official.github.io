# get_group_signed_list

获取指定群聊当天的打卡成员列表。接口使用萌卡 NT 当前账号的 Android 登录态访问 QQ 官方群打卡 TRPC Web 服务。

```js
const members = await api.get_group_signed_list(1060221, 123456789)
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行查询的在线 Bot QQ 号 |
| `group_id` | number | 是 | 目标群号 |

成功时返回数组：

```json
[
  {
    "user_id": 106606,
    "nickname": "群内昵称",
    "signed_at": 1788134400,
    "rank": 1
  }
]
```

`rank` 已按 QQ 服务端的编码规则换算为实际名次。接口不使用 OneBot 的 `nick` / `time` 兼容字段。

PsKey 缓存未命中时会复用框架已有的 `OidbSvcTcp.0x102a`，随后只请求 QQ 官方 HTTPS 服务；该接口不会执行群打卡，也不会修改任何群数据。
