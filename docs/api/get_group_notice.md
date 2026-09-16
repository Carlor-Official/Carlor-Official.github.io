# get_group_notice

获取指定群聊的公告列表。接口使用萌卡 NT 当前账号的 Android 登录态访问 QQ 官方群公告服务，不依赖 NapCat、OneBot 或 PC QQ 本地数据库。

```js
const notices = await api.get_group_notice(1060221, 123456789)
```

## 参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行查询的在线 Bot QQ 号 |
| `group_id` | number | 是 | 目标群号 |

成功时返回公告数组：

```json
[
  {
    "notice_id": "notice-id",
    "sender_id": 106606,
    "published_at": 1788134400,
    "content": "公告内容",
    "images": [],
    "settings": {},
    "read_count": 12
  }
]
```

框架只返回一套原生字段，不提供 `_get_group_notice` 下划线别名，也不重复生成 OneBot 的 `message.image` / `message.images` 两套结构。

PsKey 缓存未命中时会复用框架已有的 `OidbSvcTcp.0x102a` 获取 `qun.qq.com` PsKey，随后只发起 QQ 官方 HTTPS 查询；接口不会新增 QQ 协议命令，也不会修改群公告。
