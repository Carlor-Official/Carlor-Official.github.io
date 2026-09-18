# Node.js SDK

官方发布仓库在 `sdk/nodejs` 提供正向与反向 WebSocket SDK。原生 IPC 插件使用框架注入的运行时连接，不需要自行监听或暴露端口；同一业务代码可以保留 WS 适配层，以便独立部署。

## 正向连接示例

```js
import { createAPI } from './sdk.js'

const api = createAPI({
  host: '127.0.0.1',
  port: 3001,
  token: process.env.MENGKA_PLUGIN_TOKEN,
  name: 'example-plugin',
  version: '1.0.0',
  author: 'your-name',
})

await api.connect()
```

## 接入要求

- 原生托管包需声明 `native-ipc-v1`，并通过运行时上下文检查管理 API 版本与 action 能力；
- 令牌通过环境变量或受保护配置注入；
- 连接成功后先读取插件上下文；
- action 失败时处理统一错误结果，不把网络成功等同于业务成功；
- 事件处理器需要可重入，并记录足够但不泄露密钥的诊断信息；
- 版本升级前运行 SDK 自带的契约测试。

## v2.4.0 说明

- 插件市场入口已移除，用户通过框架「插件导入」上传成品包；
- 原生 IPC 与正向/反向 WebSocket 使用同一套 action、事件和权限语义；
- `get_plugin_context` 返回的能力列表仍是运行时兼容性的最终依据。

[查看 SDK 源文件与完整说明](https://github.com/Carlor-Official/Mengka-NT/tree/main/sdk/nodejs)
