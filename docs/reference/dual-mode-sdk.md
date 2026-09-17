# 同一个外部服务支持正向与反向接入

同一套业务代码可以根据部署环境选择本地托管、正向 WebSocket 或反向 WebSocket。框架不读取官网插件清单，本地托管包由管理员在「插件 → 插件导入」上传；外部服务连接在「插件 → 插件对接」中创建。

## 选择方向

| 部署方式 | 连接方向 | 适用场景 |
| --- | --- | --- |
| 本地导入 | 框架启动插件并自动创建正向连接 | 提供 ZIP 或 TAR.GZ 成品包，希望由框架托管运行 |
| 正向 WS | 外部服务连接框架监听端口 | 插件能主动访问框架，框架端口可达 |
| 反向 WS | 框架连接外部服务地址 | 外部服务已有固定 `ws://` 或 `wss://` 入口 |

## Node.js 统一入口

```javascript
import { createPluginConnection } from './plugin-connection.js'

const plugin = createPluginConnection({
  name: 'demo-plugin',
  version: '1.0.0',
  author: 'Demo Developer',
  manual: {
    mode: process.env.DEMO_WS_MODE || 'forward',
    host: process.env.DEMO_WS_HOST || '127.0.0.1',
    port: Number(process.env.DEMO_WS_PORT || 3001),
    token: process.env.DEMO_WS_TOKEN,
  },
})

plugin.api.on('group_message_received', event => {
  void handleMessage(event).catch(console.error)
})

await plugin.start()
```

正向模式负责连接框架，反向模式负责监听并等待框架接入。请求断线后应返回错误，不自动重放审批、发消息等有副作用的操作。

## 管理端登录

外部服务可以保留自己的本地管理员账号密码。若要从框架服务卡片进入管理端，在创建服务时填写管理端地址，并接入框架一次性 SSO 交换接口。两种登录方式互不覆盖：直接访问管理端使用插件自己的会话，从框架进入时使用短期一次性授权码。

服务令牌只用于 WebSocket 鉴权，不能作为浏览器登录令牌。
