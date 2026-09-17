# 本地托管插件接入

本地导入插件由萌卡 NT 负责安装、启动和 WebSocket 连接。官网清单、远程下载和在线更新不参与这条链路。

## 安装包结构

框架会在安装包中查找当前系统可运行的程序，优先匹配插件 ID、插件名称以及 `start`、`run`、`main`、`app`。如果存在多个同优先级入口，安装会停止并要求开发者整理安装包。

需要明确启动参数时，可在包根目录提供 `mengka-managed.json`：

```json
{
  "runtime": {
    "entry": "bin/my-plugin",
    "args": ["--connection", "{connection}"],
    "health_path": "/api/managed/health",
    "admin": false
  }
}
```

`{connection}` 会替换为框架生成的私有连接文件，`{data}` 会替换为插件数据目录。路径必须位于安装包内部。

## 运行环境

框架启动插件时提供：

| 环境变量 | 内容 |
| --- | --- |
| `MENGKA_MANAGED_V1` | 固定为 `1` |
| `MENGKA_PLUGIN_CONNECTION_FILE` | 私有 WebSocket 连接配置 |
| `MENGKA_PLUGIN_DATA_DIR` | 持久化业务数据目录 |
| `MENGKA_PLUGIN_ADMIN_HOST` | 管理端回环监听地址 |
| `MENGKA_PLUGIN_ADMIN_PORT` | 管理端分配端口 |
| `MENGKA_PLUGIN_ADMIN_TOKEN_FILE` | 管理端内部令牌文件 |
| `MENGKA_PLUGIN_ADMIN_ORIGIN` | 配置后的管理端访问来源 |

连接文件包含 WebSocket 地址、令牌文件、实例 ID 和数据目录。插件每次启动都应重新读取，不能把令牌发给浏览器或写入普通日志。

## 生命周期

插件收到激活控制后再启动业务任务，停止控制到达时先停止定时任务。健康接口返回 `ready` 和 `configured`，便于框架区分进程已启动与业务已经配置。

本地导入不会授予插件额外 action。插件只能通过生成的 WebSocket 服务调用框架公开接口，连接和事件约定与[正向 WebSocket](/reference/forward-websocket.html)一致。
