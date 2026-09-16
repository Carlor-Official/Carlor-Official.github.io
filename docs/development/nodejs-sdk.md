# Node.js SDK

官方发布仓库在 `sdk/nodejs` 提供正向与反向 WebSocket SDK。

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

- 令牌通过环境变量或受保护配置注入；
- 连接成功后先读取插件上下文；
- action 失败时处理统一错误结果，不把网络成功等同于业务成功；
- 事件处理器需要可重入，并记录足够但不泄露密钥的诊断信息；
- 版本升级前运行 SDK 自带的契约测试。

[查看 SDK 源文件与完整说明](https://github.com/Carlor-Official/Mengka-NT/tree/main/sdk/nodejs)
