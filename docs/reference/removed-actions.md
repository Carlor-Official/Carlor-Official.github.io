# 已移除的账号离线接口

`offline_account` 已从当前框架移除，v2.0.6 不提供此 action，也没有降级或别名兼容。此页仅为旧链接提供迁移提示，不属于当前 API 目录。

请更新官方 SDK，改用 `stop_account_login`，明确提供目标账号与协议：

```js
await api.forProtocol('linuxqq').stop_account_login(self_id)
// Android 使用 api.forProtocol('android')
```

停止操作可取消正在进行的登录或下线已登录账号，不删除账号或缓存。具体字段与状态见[停止账号登录](/api/stop_account_login.html)。服务连接不绑定节点，由框架按账号实际节点执行。
