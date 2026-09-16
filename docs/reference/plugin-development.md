# 插件开发入门

萌卡NT 通过 WebSocket 与外部插件通信。插件可以接收事件，并通过同一条连接调用 API。

## 选择连接模式

| 模式 | 连接发起方 | 适用场景 |
| --- | --- | --- |
| 正向 WebSocket | 插件连接萌卡NT | 插件与萌卡NT在同一设备或插件能访问萌卡NT端口 |
| 反向 WebSocket | 萌卡NT连接插件 | 插件有稳定地址，或希望由萌卡NT负责断线重连 |

两种模式使用相同的 API 和事件数据。区别只在连接方向与初始化方法。

推荐使用[双模式接入 SDK 与免登初始化](/reference/dual-mode-sdk.html)：同一个插件支持手动正向/反向 WS 和市场自动部署。官网发布填写基本资料、各系统安装包与启动文件、接入及 Web 后台信息，审核通过后上架；无需填写权限清单或托管 JSON。市场模式由框架生成连接与管理凭据，手动模式保留独立管理员登录。

## 获取示例

发行仓库的 [`sdk/nodejs`](https://github.com/Carlor-Official/Mengka-NT/tree/main/sdk/nodejs) 提供不带版本子目录的正向与反向 Node.js SDK。可运行示例包含 `sdk.js`、`index.js` 和 `package.json`：

```text
plugin/
├─ 正向WebSocket/Node.js/
└─ 反向WebSocket/Node.js/
```

进入对应示例目录后安装依赖：

```bash
npm install
```

示例使用 ECMAScript Modules 和 `ws`。

## 配置插件服务

在萌卡NT管理后台创建插件服务。两种模式都需要填写：

| 字段 | 说明 |
| --- | --- |
| 名称 | 插件服务的唯一名称 |
| 模式 | 正向 WS 或反向 WS |
| 服务令牌 | 插件与萌卡NT之间使用的共享令牌 |
| 启用状态 | 启用后启动监听或连接任务 |

正向模式还需要监听端口；反向模式需要 WebSocket 地址和重连间隔。

::: tip 账号路由
插件服务不绑定节点。账号 action 使用 `self_id + client_type` 选择唯一协议账号，再由框架在该账号自己的登录节点上执行；事件范围由服务声明或安装授权快照决定。
:::

## 正向模式示例

先注册事件，再连接：

```js
import { createAPI } from './sdk.js'

const api = createAPI({
  host: '127.0.0.1',
  port: 3001,
  token: '与管理后台一致的服务令牌',
  name: 'hello-plugin',
  version: '1.0.0',
  author: 'developer',
})

api.on('group_message', event => {
  console.log(event.group_id, event.alt_message)
})

await api.connect()

const result = await api.get_group_list(123456789)
console.log(result.groups)
```

`on()` 应在 `connect()` 前调用。正向 SDK 会根据已注册的监听器声明事件权限。

## 反向模式示例

```js
import { createReverseAPI } from './reverse-sdk.js'

const api = createReverseAPI({
  host: '0.0.0.0',
  port: 3002,
  path: '/',
  token: '与管理后台一致的服务令牌',
})

api.on('bot_offline', event => {
  console.log(event.self_id, event.err_msg)
})

await api.listen()
await api.waitForConnection()
```

随后在管理后台填写 `ws://127.0.0.1:3002/`。完整配置见[反向 WebSocket](/reference/reverse-websocket.html)。

## 错误处理

大多数 API 返回 Promise。传输成功时 Promise 解析为业务数据；API 校验或执行失败时 Promise 抛出错误。

```js
try {
  const result = await api.get_friend_list(self_id)
  console.log(result.friends)
} catch (error) {
  console.error(error.message)
}
```

API 默认等待 30 秒。连接断开时，所有尚未完成的请求都会结束。
