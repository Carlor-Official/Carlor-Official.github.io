# set_group_admin

设置或取消群聊管理员。

v2.0.6 检查 SSO 错误以及原生命令、服务号和显式状态；缺少状态、空响应、畸形响应及重复状态字段均按失败处理。非零服务状态保留错误码。网络或响应异常不能证明操作未执行，请先回读成员角色确认，不要直接重复操作。

操作响应和事件送达是独立结果。框架 API 发起的管理员修改通过服务器状态回读确认变化，已验证目标成员和群主的 Android/Linux 经双正向及单反向 WS 收到设置、取消和恢复事件。回读事件带有 `source: "server_readback"`，详见[群管理变化](/events/notice.html#服务器回读确认)。其他客户端直接修改不属于此实测范围。

## 调用

```js
const result = await api.set_group_admin(
  self_id,
  group_id,
  target_uin,
  set_admin,
)
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 在线 Bot QQ 号 |
| `group_id` | number | 是 | 群聊 ID |
| `target_uin` | number | 是 | 目标成员 QQ 号 |
| `set_admin` | boolean | 是 | `true` 设置，`false` 取消 |

## 返回值

```js
{
  group_id: 987654321,
  target_uin: 112233445,
  set_admin: true,
}
```
