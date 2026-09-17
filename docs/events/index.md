# 萌卡原生事件

本文对应已发布的框架 v2.0.6，共 26 个精确事件、7 个大类监听入口。萌卡 NT 将 QQ 原生推送或明确标记的服务器回读结果规范化为事件对象；推荐监听具体事件，避免插件自行判断多个字段。

```js
api.on('group_member_joined', event => {
  console.log(event.event_id, event.group_id, event.user_id)
})
```

## 公共字段

每个事件都包含以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `event_id` | string | 本次广播的唯一事件标识 |
| `occurred_at` | number | 框架接收并规范化事件的 Unix 毫秒时间戳 |
| `category` | string | `message`、`notice`、`request` 或 `system` |
| `event_type` | string | 具体事件名，也是 SDK 的精确监听器名称 |
| `self_id` | number | 相关 Bot QQ；框架级系统事件为 `0` |
| `client_type` | string | `android`、`linuxqq` 或 `framework` |
| `post_type` | string | 对应下表中的大类监听入口；不是权限字段名 |

事件 ID 在同一次框架广播中保持一致，可用于插件去重和链路追踪。`occurred_at` 是框架确认事件的时间；消息自身时间仍以 `msg.time` 为准。

v2.0.6修复原生推送与并发 API 回复序号冲突时丢失事件的问题：框架同时匹配请求序号和命令，不把其他命令的推送当作 API 回复。此修复不改变事件字段或订阅方式，也不代表所有实机场景已完成验收。

v2.0.6 另修复同一账号连接的业务推送乱序：按入站顺序处理通知，API 回复不等待业务通知回读完成。连接切换时取消旧队列及回读，延迟离群提示保留原连接的有效性检查。顺序保证针对同一连接，不是不同账号或协议间的全局顺序；断线期间不保证事件重放。队列超过数量或内存上限会明确记录并断开连接，插件恢复后应查询当前业务状态。该顺序处理已在有限混合场景中验证；不保证断线期间事件重放。

## 事件目录

### 消息

| 精确监听器 | 说明 |
| --- | --- |
| `private_message_received` | 收到好友私聊消息 |
| `group_message_received` | 收到群聊消息 |
| `message_sent` | 框架确认由插件发出的消息 |

### 通知

| 精确监听器 | 说明 |
| --- | --- |
| `friend_added` | 好友关系建立 |
| `friend_message_recalled` | 好友消息被撤回 |
| `group_message_recalled` | 群消息被撤回 |
| `group_member_joined` | 群成员加入 |
| `group_member_left` | 群成员退出或被移出 |
| `group_admin_changed` | 群管理员状态变化 |
| `group_member_muted` | 群成员禁言状态变化 |
| `group_file_uploaded` | 群文件上传提示 |
| `group_card_changed` | 群名片变化 |
| `group_name_changed` | 群名称变化 |
| `group_title_changed` | 群成员头衔变化 |
| `group_essence_changed` | 群精华状态变化 |
| `group_system_tip` | 未归入专用类型的群系统提示 |
| `message_reaction_changed` | 消息表情回应变化 |
| `user_poked` | 戳一戳互动 |
| `profile_liked` | 个人资料获赞 |
| `typing_status_changed` | 好友输入状态变化 |

### 请求

| 精确监听器 | 说明 |
| --- | --- |
| `friend_request_received` | 收到好友申请 |
| `group_request_received` | 收到入群申请或邀请 |

### 系统

| 精确监听器 | 说明 |
| --- | --- |
| `system_lifecycle` | 插件连接生命周期变化 |
| `system_heartbeat` | 插件连接存活心跳 |
| `account_online` | Bot 账号完成登录并上线 |
| `account_offline` | Bot 账号离线 |

## 大类监听

以下监听器仍可用于一次接收同类事件。精确监听器和大类监听器同时注册时，两者都会收到同一个事件对象。

| 大类监听器 | 覆盖范围 |
| --- | --- |
| `group_message` | 群聊消息 |
| `friend_message` | 好友消息 |
| `request` | 好友与群请求 |
| `group_notice` | 群通知 |
| `friend_notice` | 好友通知 |
| `system_event` | 连接生命周期、心跳与账号上线 |
| `bot_offline` | Bot 离线 |

## 数据可靠性

事件只使用当前 QQ 推送或框架回读能够确认的数据。群系统卡片在不同客户端版本中字段可能变化，框架会输出稳定的 `summary` 和已确认的参与人；无法确认的文件名、消息 ID 或操作者不会使用猜测值补齐。

正向 SDK 应在 `connect()` 前注册监听器，以便认证时声明所需事件范围。本地导入包不会因为被上传而自动获得额外事件权限。

### 慢连接隔离

每条 WS 使用独立的有序事件发送队列，接收慢的插件不会拖住其他插件或账号原生推送处理。单连接最多排队 256 条事件，待发送及正在发送的数据合计不超过 8 MiB。队列超限或写入失败时，框架记录原因并断开该连接，不会静默跳过事件后继续维持表面正常的连接。

这不是持久化消息队列：断线期间的事件不保证补发。插件重连后应重新查询所需业务状态；不得因为断线而自动重复加好友、审批、发送消息等有副作用的 action。权限、事件名称和数据结构不变，同一次广播的 `event_id` 在不同 WS 中仍一致。

## 回调异常

SDK 会捕获同步回调异常并记录事件名，不会因此断开 WebSocket。异步回调仍应自行处理异常：

```js
api.on('private_message_received', event => {
  void handleMessage(event).catch(console.error)
})
```

## 订阅权限与多连接

| 事件范围 | 认证权限字段 |
| --- | --- |
| 群消息 / 好友消息 | `group_message` / `friend_message` |
| 好友及群申请 | `request` |
| 群通知 / 好友通知 | `group_event` / `friend_event` |
| 连接、心跳、账号上线 | `system_event` |
| 账号离线 | `bot_offline` |

SDK 导出的 `NATIVE_EVENTS` 包含 7 个大类和 26 个精确监听器，共 33 项；不能把 33 项都算成独立业务事件。精确监听器自动声明对应权限；`user_poked` 同时涉及群和好友通知，`message_sent` 同时涉及群和好友消息。群申请监听器同时声明 `request` 和 `group_event`；当前框架对群申请接受其中任一权限，好友申请必须有 `request`。

WS 是插件通道，节点是账号运行环境。合法服务可接收其订阅权限内不同节点账号的事件；同一账号/协议事件向多个 WS 投递时 `event_id` 一致，不同账号或协议不能只按业务内容合并。系统生命周期和心跳按连接独立生成，详见[系统事件](/events/system.html)。

## 验证边界

发布前已用两个 QQ、Android/Linux 四会话、两节点、两条正向和一条反向 WS 验证 26 类事件各自列明的触发场景，包括真实消息及引用、群图片、申请与成员变化、互动、回读确认、上线/主动离线/网络断开、连接和周期心跳。部分专项只使用两条正向 WS，不与三路结果混算。

这些结果不是任意外部 QQ 客户端模板、全部媒体格式或所有离线原因的保证。好友图片、非好友临时会话引用、真实被踢及票据过期、自然禁言到期、全员禁言、邀请待审批等未被这组真实回归覆盖。各详情页说明字段可用条件；API 成功不等于事件送达，断线期间不保证补发。
