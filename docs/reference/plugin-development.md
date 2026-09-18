# 插件开发入门

萌卡 NT 现在优先支持“框架内原生运行”插件：用户从「插件 → 插件导入」上传可信成品包，框架在本地插件目录中安装、启动并管理它。插件通过原生 IPC 调用框架 API，不需要额外开放 WebSocket 端口。需要独立部署时，仍可使用正向或反向 WebSocket。

## 选择连接模式

| 模式 | 连接发起方 | 适用场景 |
| --- | --- | --- |
| 原生 IPC | 框架启动插件并通过标准输入输出通信 | 推荐的本地托管方式，不开放额外端口 |
| 正向 WebSocket | 插件连接萌卡 NT | 独立进程或跨主机部署 |
| 反向 WebSocket | 萌卡 NT 连接插件 | 插件有稳定可访问地址 |

两种模式使用相同的 API 和事件数据。区别只在连接方向与初始化方法。

推荐让同一个插件同时支持原生 IPC、正向 WS 和反向 WS。原生 IPC 插件在包内声明 `transport: native-ipc-v1` 与 action 能力；用户上传后由框架生成运行目录、数据目录和生命周期控制。外部部署则在「插件 → 插件对接」中创建正向或反向 WS 服务。当前不再依赖官网插件清单、远程下载或市场审核。

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

## 配置外部插件服务

仅在插件独立运行或跨主机时需要在萌卡 NT 管理后台创建插件服务。两种 WS 模式都需要填写：

| 字段 | 说明 |
| --- | --- |
| 名称 | 插件服务的唯一名称 |
| 模式 | 正向 WS 或反向 WS |
| 服务令牌 | 插件与萌卡NT之间使用的共享令牌 |
| 启用状态 | 启用后启动监听或连接任务 |

正向模式还需要监听端口；反向模式需要 WebSocket 地址和重连间隔。原生 IPC 插件无需填写这些字段，由导入包的运行时声明负责连接。

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
