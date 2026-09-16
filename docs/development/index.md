# 插件开发

萌卡 NT 通过正向或反向 WebSocket 连接插件服务。服务使用令牌认证，普通账号 action 根据 `self_id + client_type` 自动路由到账号自己的登录节点。

## 推荐接入路径

1. 在框架 WebUI 创建插件服务并选择连接模式；
2. 使用 [Node.js SDK](/development/nodejs-sdk.html) 建立连接；
3. 通过 `get_plugin_context` 检查管理 API 版本与可用 action；
4. 根据业务订阅事件并处理统一 action 结果；
5. 需要管理页面时再接入 [WebUI SDK](/development/webui-sdk.html)。

完整的[接口参考](/api/)与[事件文档](/events/)按功能分类。具体能力与参数会随版本变化，开发时应以目标 Release 中的 SDK 文档和运行时上下文为准。

::: warning 令牌安全
插件令牌只能保存在服务端或受保护的运行环境中，不得写入浏览器前端、公开仓库、日志或 URL。
:::
