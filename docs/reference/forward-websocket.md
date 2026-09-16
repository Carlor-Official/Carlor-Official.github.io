# 正向 WebSocket

正向模式下，萌卡NT监听一个 WebSocket 端口，插件作为客户端连接该端口。

## 后台配置

在插件服务中选择“正向 WS”，填写服务名称、监听端口和服务令牌。插件服务不绑定账号节点；监听地址由萌卡NT管理，插件通常连接：

```text
ws://HOST:PORT/
```

同一端口只能由一个插件服务使用。

## SDK 配置

```js
const api = createAPI({
  host: '127.0.0.1',
  port: 3001,
  token: 'TOKEN',
  name: 'plugin-name',
  version: '1.0.0',
  author: 'developer',
})
```

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | 否 | `127.0.0.1` | 萌卡NT所在主机 |
| `port` | 否 | `3001` | 管理后台配置的监听端口 |
| `token` | 是 | - | 服务令牌 |
| `name` | 是 | - | 插件名称，显示在连接列表中 |
| `version` | 是 | - | 插件版本 |
| `author` | 是 | - | 插件作者 |

## 连接生命周期

```js
api.on('friend_message', handleFriendMessage)

await api.connect()

// 退出时
api.disconnect()
```

正向 SDK 不主动重连。需要持续运行的插件应在连接断开后按自身策略重新调用 `connect()`。

## 事件权限

SDK 在认证时根据已注册的监听器声明权限：

| 监听器 | 权限字段 |
| --- | --- |
| `group_message` | `group_message` |
| `friend_message` | `friend_message` |
| `group_notice` | `group_event` |
| `friend_notice` | `friend_event` |
| `bot_offline` | `bot_offline` |

在 `connect()` 之后新增监听器不会更新本次连接的权限声明。需要新增事件类型时，断开并重新连接。

## 原始认证帧

使用其他语言实现客户端时，连接建立后 10 秒内发送：

```json
{
  "type": "auth",
  "token": "TOKEN",
  "name": "plugin-name",
  "version": "1.0.0",
  "author": "developer",
  "permissions": {
    "group_message": true,
    "friend_message": true,
    "group_event": true,
    "friend_event": true,
    "bot_offline": true
  }
}
```

认证成功：

```json
{ "type": "auth_ok" }
```

认证失败：

```json
{ "type": "auth_failed", "message": "令牌错误" }
```

后续帧格式见[通信协议](/reference/protocol.html)。

## 插件市场托管运行

通过插件市场快捷安装并“添加服务”时，框架会创建监听服务、下发连接配置并托管插件进程。安装包不需要 `mengka-plugin.json`；框架会自动识别可执行入口。只有需要自定义启动参数、工作目录、配置或 Web 后台时，才提供可选运行描述：

```json
{
  "schema_version": 1,
  "entrypoint": "bin/my-plugin",
  "arguments": ["--connection", "{{connection_file}}"],
  "working_directory": ".",
  "configuration": {
    "schema": "config.schema.json"
  }
}
```

开发者在官网发布页从当前框架清单中多选 API 与事件；审核通过并安装后，这组选择成为服务的唯一授权快照。安装包中的任何字段都不能扩大或缩小权限。

框架启动进程时会提供以下环境变量：

| 环境变量 | 说明 |
| --- | --- |
| `MENGKA_PLUGIN_ID` | 插件市场中的稳定插件 ID |
| `MENGKA_PLUGIN_MODE` | `forward` 或 `reverse` |
| `MENGKA_PLUGIN_WS_URL` | 框架为该插件分配的 WebSocket 地址 |
| `MENGKA_PLUGIN_CONNECTION_FILE` | 不含明文令牌的连接配置 JSON |
| `MENGKA_PLUGIN_TOKEN_FILE` | 仅插件进程可读的令牌文件 |
| `MENGKA_PLUGIN_CONFIG_FILE` | 普通配置与敏感项引用 JSON |
| `MENGKA_PLUGIN_SECRETS_FILE` | 仅插件进程可读的敏感值 JSON |

市场托管进程不提供明文 `MENGKA_PLUGIN_TOKEN` 环境变量。参数和可选运行描述中的环境变量值支持 `{{package_root}}`、`{{runtime_dir}}`、`{{connection_file}}`、`{{token_file}}`、`{{connection_url}}` 占位符。市场托管服务优先级高于普通 SDK 服务；托管进程停止或连接断开时，框架会自动回退到仍在线的普通 SDK 连接。

### 将插件网页后台嵌入框架

插件可以在可选的 `mengka-plugin.json` 中声明网页后台：

```json
{
  "schema_version": 1,
  "entrypoint": "bin/my-plugin",
  "arguments": [
    "--connection", "{{connection_file}}",
    "--admin-host", "{{admin_host}}",
    "--admin-port", "{{admin_port}}"
  ],
  "working_directory": ".",
  "web_admin": {
    "enabled": true,
    "title": "我的插件后台",
    "health_path": "/api/status",
    "auth_type": "header",
    "auth_header": "X-Mengka-Admin-Token"
  }
}
```

框架为后台分配仅监听 `127.0.0.1` 的随机端口，并通过已登录管理员才能访问的同源代理嵌入管理端。插件的管理令牌由框架保存在运行目录并在代理端注入，不会发送给浏览器。

新增环境变量如下：

| 环境变量 | 说明 |
| --- | --- |
| `MENGKA_PLUGIN_ADMIN_HOST` | 固定为 `127.0.0.1` |
| `MENGKA_PLUGIN_ADMIN_PORT` | 框架为本次插件进程分配的后台端口 |
| `MENGKA_PLUGIN_ADMIN_BASE_PATH` | 插件前端在框架内访问 API 的路径前缀 |
| `MENGKA_PLUGIN_ADMIN_TOKEN_FILE` | 仅插件进程可读的后台令牌文件 |
| `MENGKA_PLUGIN_ADMIN_EMBEDDED` | 框架托管时为 `1` |

对应清单占位符为 `{{admin_host}}`、`{{admin_port}}`、`{{admin_base_path}}`、`{{admin_token_file}}`。网页前端应使用 `sdk/plugin-web` 解析 API 路径，并将 Vite 等构建工具的资源基础路径设置为相对路径 `./`。
