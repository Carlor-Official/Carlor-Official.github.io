# get_group_honor_info

获取指定群聊的实时荣誉榜单。接口使用萌卡 NT 当前账号的 Android 登录态访问 QQ 官方群荣誉服务。

```js
const honor = await api.get_group_honor_info(106606, 106500, 'all')
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 发起查询的在线 Bot QQ 号 |
| `group_id` | number | 是 | 目标群号 |
| `type` | string | 否 | `all`、`talkative`、`performer`、`legend` 或 `emotion`，默认 `all` |

返回萌卡原生结构：

```json
{
  "group_id": 106500,
  "type": "all",
  "current_talkative": {
    "user_id": 106606,
    "nickname": "群成员",
    "avatar": "https://example.com/avatar.jpg",
    "description": "9天，最长蝉联3天"
  },
  "rankings": {
    "talkative": [],
    "performer": [],
    "legend": [],
    "emotion": []
  }
}
```

QQ 当前没有可用的“冒尖小春笋”查询端点，因此原生接口不接受 `strong_newbie`，也不保留只为兼容旧框架存在的空字段。

该接口只复用现有 PsKey 获取链路并执行 QQ 官方 HTTPS 查询。`type=all` 会依次读取四类榜单，但不会修改群资料或账号状态。
