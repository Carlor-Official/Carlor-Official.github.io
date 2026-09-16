# API 与事件

## Action 调用

已认证插件可以调用框架注册的 action。账号相关调用通常需要 `self_id` 与 `client_type`，框架据此选择账号自身配置的节点；账号和节点管理操作才会显式使用 `node_id`。

```js
const result = await api.call('get_friend_list', {
  self_id: '123456789',
  client_type: 'linux',
})
```

不同 action 的参数、返回值和可用边界，请以 [官方 Node.js SDK 文档](https://github.com/Carlor-Official/Mengka-NT/blob/master/sdk/nodejs/README.md) 为准。

## 运行时能力发现

插件启动后应调用 `get_plugin_context`，读取：

- `management_api_version`：当前管理 API 版本；
- `available_actions`：运行实例实际提供的 action；
- 其他服务上下文与兼容性信息。

不要仅凭官网列表假设目标实例一定已经升级。

## 在线调试

v2.3.x 的框架 WebUI 提供在线 API 调试页，可填写参数、预览 JSON / Python / JavaScript / cURL 请求，并在明确点击发送后执行一次调用。请求预览本身不会发送数据。
