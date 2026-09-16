# 插件托管与权限协议

萌卡 NT 继续以正向或反向 WebSocket 作为插件数据面。官网权限快照、托管运行、配置、生命周期、任务和可选 HTTP Webhook 构成控制面；HTTP 适配不会替代 WebSocket。

## 权限快照是唯一授权来源

开发者在官网发布页从当前框架能力目录选择 API 与事件，审核通过后在安装时冻结为服务授权快照。市场服务只能调用快照内的 action，也只接收快照内的事件。

- 安装包不需要 `mengka-plugin.json`。
- 包内同名文件中的 `capabilities` 字段会被忽略，不参与权限校验。
- 扩大或缩小权限都要发布新版本、重新审核并重新安装。
- 手工创建的正向/反向 WS 服务继续按兼容策略运行，不会伪装成已审核的市场服务。

## 无清单启动与可选运行描述

没有清单文件时，框架会自动查找可执行入口，优先匹配插件 ID 以及 `bin`、`release` 目录。若存在多个同等优先级的入口，框架会拒绝猜测并提示整理安装包。

只有需要精确指定启动参数、工作目录、配置 Schema 或内置 Web 后台时，才需要可选的 `mengka-plugin.json`：

```json
{
  "schema_version": 1,
  "entrypoint": "bin/plugin",
  "arguments": ["--connection", "{{connection_file}}"],
  "working_directory": ".",
  "configuration": {
    "schema": "config.schema.json"
  },
  "web_admin": {
    "enabled": false
  }
}
```

这个文件只描述如何启动和管理插件，不能声明运行权限。文件缺失、无法解析或入口无效时，框架会回退到安全的自动入口识别。

同一插件可以发布 Windows amd64、Linux amd64 和 Linux arm64 构件。官网从 GitHub/Gitee Releases 的附件名自动识别 `amd64`/`x86_64` 与 `arm64`/`aarch64`，市场目录分别返回 `os` 和 `arch`。框架只安装与当前 `GOOS/GOARCH` 精确匹配的构件；Linux 包内 ELF 文件在启动前还会再次校验机器架构，避免脚本入口间接启动错误二进制时最终只表现为 `exit status 126`。

市场托管进程可使用：

| 环境变量 | 内容 |
| --- | --- |
| `MENGKA_PLUGIN_ID` | 稳定插件 ID |
| `MENGKA_PLUGIN_MODE` | `forward` 或 `reverse` |
| `MENGKA_PLUGIN_WS_URL` | 当前服务 WebSocket 地址 |
| `MENGKA_PLUGIN_CONNECTION_FILE` | 不含明文令牌的连接信息 |
| `MENGKA_PLUGIN_TOKEN_FILE` | 权限受限的服务令牌文件 |
| `MENGKA_PLUGIN_CONFIG_FILE` | 普通配置和敏感项引用 |
| `MENGKA_PLUGIN_SECRETS_FILE` | 权限受限的敏感值文件 |

市场托管进程不提供明文 `MENGKA_PLUGIN_TOKEN` 环境变量。插件应使用 `MENGKA_PLUGIN_TOKEN_FILE` 或连接文件。

## 配置与敏感项

`configuration.schema` 指向包内 JSON Schema。当前要求顶层为 `object`，属性支持 `string`、`integer`、`number`、`boolean`、`array` 和 `object`。敏感字符串使用 `x-mengka-secret`：

```json
{
  "type": "object",
  "required": ["api_key"],
  "properties": {
    "api_key": {
      "type": "string",
      "title": "API Key",
      "x-mengka-secret": true
    },
    "interval": {
      "type": "integer",
      "default": 60
    }
  }
}
```

敏感项不能声明默认值。普通配置文件只保留 `{"$secret":"api_key"}` 引用；GET 接口只返回普通值和 `secrets_set` 名称。

- `GET /api/v1/plugins/market/{plugin_id}/config`
- `PUT /api/v1/plugins/market/{plugin_id}/config`，请求体 `{"values":{...}}`

## 生命周期与控制注册

市场托管插件认证成功后收到 `{"type":"lifecycle","event":"started"}`。停止、重启和配置更新对应 `stopping`、`restarting`、`config_changed`。

插件可在原连接注册命令、菜单和周期任务：

```json
{
  "type": "control_register",
  "id": "register-1",
  "commands": [{"name": "bili.subscribe", "description": "订阅 UP 动态"}],
  "menus": [{"id": "bili-settings", "title": "B站设置", "path": "/plugins/bili/settings"}],
  "jobs": [{"id": "poll-dynamic", "interval_seconds": 60, "run_on_start": true}]
}
```

框架返回 `control_result`，到期任务发送 `job_trigger`。周期范围为 30 秒至 7 天；命令、菜单、任务每类最多 128 项。注册内容只属于当前在线连接，断线后不会残留执行。

管理员服务控制接口：

- `POST /api/v1/plugins/{service_id}/start`
- `POST /api/v1/plugins/{service_id}/stop`
- `POST /api/v1/plugins/{service_id}/restart`

## 可选 HTTP Webhook

HTTP 适配默认关闭。管理员配置 Hook 白名单并轮换独立密钥后，外部系统可调用：

```text
POST /api/v1/plugin-webhooks/{service_id}/{hook}
X-Mengka-Webhook-Token: <secret>
```

请求体上限 1 MiB。认证、白名单和在线检查通过后，框架在原 WS 连接发送 `http_webhook` 帧。数据库只保存密钥 SHA-256；明文只在轮换响应中返回一次。未启用返回 404，插件离线返回 503。

- `GET /api/v1/plugins/{service_id}/http-adapter`
- `PUT /api/v1/plugins/{service_id}/http-adapter`
- `GET /api/v1/plugins/{service_id}/http-adapter/openapi.json`

## 兼容与迁移

- 升级前已有服务保持 `legacy_all`，避免升级瞬间中断。
- 新市场服务默认使用 `declared`，action 和事件只允许安装快照内项目。
- 手工正反向 WS 服务继续使用原方式；新控制能力以市场托管服务为主要边界。
- 旧官网文章再次发布时由开发者在官网重新确认 API 与事件，安装包内容不会改变授权范围。
- HTTP Webhook 只是一层外部入口适配，不开放新的框架 action，也不绕过 Action ACL。
