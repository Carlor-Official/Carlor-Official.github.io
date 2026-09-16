# get_plugin_context

读取当前插件服务的管理 API 上下文，适合在管理端启动时确认连接目标与契约版本。

v2.1.0 的 `management_api_version` 为 `1`，`available_actions` 共 53 项，包含从 v2.0.9 引入的六个共享等级任务管理接口；`level_task_management_api_version` 为 `1`。插件必须检查所需 action 是否在列表中，不能仅因版本字段为 1 就假定全部能力存在。该列表是管理能力子集，不是全部 233 个公开 action。

## 调用

```js
const context = await api.get_plugin_context()
```

## 返回值

```js
{
  service_id: 1,
  service_name: 'mengka-user-system',
  management_api_version: 1,
  level_task_management_api_version: 1,
  available_actions: ['get_plugin_context', 'get_account_management_context', 'get_node_list'],
  admin_base_url: 'http://127.0.0.1:7891'
}
```

`available_actions` 是当前版本的能力发现列表，不是逐项授权清单。当前服务通过 Token 认证后可直接调用这些管理 API。插件服务不再返回 `node_id`；账号 action 根据 `self_id + client_type` 使用账号自身登录节点。`system_management` 与 `allowed_actions` 已删除。
