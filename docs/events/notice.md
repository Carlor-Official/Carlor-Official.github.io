# 通知事件

本文对应框架 v2.0.6。通知事件的 `category` 为 `notice`。群通知大类是 `group_notice`、认证权限为 `group_event`；好友通知大类是 `friend_notice`、认证权限为 `friend_event`。推荐使用精确监听器，由 SDK 声明对应权限。

## 群成员变化

### group_member_joined

| 字段 | 说明 |
| --- | --- |
| `group_id`, `group_name` | 目标群 |
| `user_id`, `nickname` | 已确认的新成员 QQ 与名称 |
| `user_uid` | v2.0.6：原生成员 UID，即使 QQ 映射尚未准备好也能标识成员 |
| `invitor_id`, `invitor_nickname` | 邀请者，存在时返回 |
| `handler_id`, `handler_nickname` | 审核人，存在时返回 |
| `request_id`, `request_type` | 仅在确有审批记录时提供，不能用完成通知虚构申请标识 |

框架直接处理已完成的原生入群通知，不强制依赖历史审批列表。新建群、直接邀请入群可能没有待审批记录；这不应阻止 `group_member_joined`。只有实际待处理申请才进入 `group_request_received` 链路。

群主和新成员接收的原生通知不同，框架分别解析；申请者通知中的处理者 UID 不会被误当作入群者。拒绝申请不生成加入事件，新申请使用新编号。申请接收、跨协议拒绝/批准、成员加入及恢复已通过双账号、四会话、跨两节点与双正向/单反向 WS 验证；Linux 主动申请入群是不支持的能力，邀请待审批不在本次实测范围内。

v2.0.6 修复群内成员身份查询：数字 QQ 通过目标群成员列表确认；UID 详情响应必须匹配请求群号和 UID，确认后才更新身份缓存。双账号、Android/Linux 的两条查询路径已实测一致，但不代表陌生好友 UID、所有通知的触发与投递已通过。无法确认数字 QQ 的事件仍保留原生 UID，不伪造数字身份。

### group_member_left

| 字段 | 说明 |
| --- | --- |
| `group_id`, `group_name` | 目标群 |
| `user_id`, `nickname` | 离群成员 |
| `operator_id`, `operator_nickname` | 操作者，主动退群时可能省略 |
| `request_id`, `request_type` | 有实际通知记录时才返回 |
| `user_uid`, `operator_uid` | v2.0.6：已确认的原生成员/操作者 UID |
| `reason` | v2.0.6：`left`（主动退出）或 `kicked`（被移出）；原生通知未提供原因时省略 |

已完成的原生退出推送与历史通知列表解耦；缺少历史记录或操作者信息时，不丢弃已确认的成员退出通知，也不填入猜测的 QQ 号。

主动退出、踢出、拒绝后重申请及批准恢复已完成双账号、Android/Linux、跨两节点和三 WS 的相应回归，包含退群账号自身通知。v2.0.6 同时修复推送顺序、旧登录会话取消和成员去重提交顺序。调用成功不等于所有相关账号必然收到通知；未知外部模板不因此视为通过。

自身通知可能只包含群号，框架据当前接收会话填写 `self_id`、`user_id` 和已知 UID；**缺少原因和操作者时省略 `reason`、`operator_id` 等字段**，不能默认成 `left` 或 `kicked`。框架为简略自身通知保留约一秒合并窗口，优先采用随后到达的完整原生通知，避免丢掉踢人原因与操作者；无完整通知时按简略数据发送。入群会先提交待发离群事件，离线或重登撤销旧会话任务。消费事件时先按成员身份更新群成员关系，只有存在明确原因时才展示“主动退出”或“被移除”。

## 群管理变化

### 结构化字段

以下为 v2.0.6 当前字段。群名、指定成员禁言/解除，以及框架 API 发起的名片、管理员和头衔变更已完成双账号、Android/Linux、跨节点、双正向/单反向 WS 的修改与恢复验证。服务器回读与原生推送区分来源，不根据设置接口成功伪造通知。其他客户端直接修改、未知模板、自然禁言到期和全员禁言不在该实测范围内。

| 事件 | 原生字段 |
| --- | --- |
| `group_admin_changed` | `group_id`、`target`、`body.set_admin`：设置 `true`，取消 `false` |
| `group_card_changed` | `group_id`、`target`、`body.card`：可为空字符串 |
| `group_name_changed` | `group_id`、`group_name`、`operator`、`body.group_name`；相同账号的连续重复群名通知短时去重 |
| `group_title_changed` | `group_id`、`target.user_id`、`body.title`，清空时为 `""`；操作者仅在原生通知实际提供时返回 |
| `group_essence_changed` | `group_id`、`operator`、`target`（消息发送者）、`body.msg_seq`、`body.msg_random`、`body.operation`（`add` / `remove`）、`body.time`（原生秒级时间） |
| `message_reaction_changed` | `group_id`、`operator`、`body.msg_seq`、`body.emoji_id`、`body.count`、`body.operation`（`add` / `remove`） |

表情回应的 `body.message_id` 仅在当前账号的消息引用缓存命中时返回；取消后 `count` 可为 `0`。`operator` / `target` 可提供 `uid`，只有确认 QQ 号时才提供 `user_id`。原生管理员通知不含操作者时，不虚构 `operator`。这些结构化通知不保证包含 `body.summary`。

同一账号事件投递到不同 WS 时共享 `event_id`；两个账号收到同一群操作是两条账号事件，以 `self_id + client_type` 区分。

头衔的结构化分支按原生通知类型及完整 JSON 内容解析，不从“头衔”字样猜测新值；不完整、未知类型或截断通知不生成这类结构化事件。JCE 和 MsgPush 双通道按账号/协议、群和目标成员对连续相同值短时去重，不吞掉修改后恢复原值的变化。设置 API 成功、成员列表可回读新头衔，不代表服务端必然向该会话推送通知，因此不能替代事件验收。

### 服务器回读确认

框架执行名片、管理员和头衔设置时，先读取真实旧值，再由在线账号各自回读群成员列表。只有确认读取账号和目标均属于该群、实际值发生改变，才补发相应事件；不根据设置 API 的成功响应生成事件，也不自动重试设置操作。回读事件额外提供顶层 `source: "server_readback"` 和 `confirmed_at`（确认时间，毫秒），不包含无法确认的 `operator`。原生推送省略这两个字段；`occurred_at` 仍是框架生成事件的时间，不是服务器提供的历史操作时间。

原生推送和回读按账号/协议、群、目标及属性共同去重，连续相同值一分钟内不重复；A → B → A 不会被吞掉。账号离线、重登后，旧登录的回读结果不再生效。读取失败不会补发推测事件。该机制目前由框架设置 API 触发，不是覆盖所有群的周期轮询，不保证其他客户端的每次中间变化均被观察到。

### 系统提示结构

`group_system_tip` 使用下列摘要结构。专用群管理事件由原生结构化字段或明确标注的服务器回读生成，不能仅凭系统卡片文案生成；其字段以上表为准。事件名存在不代表所有协议入口都已完成实机验收。

```js
{
  group_id,
  group_name,
  operator: { user_id, nickname }, // 能确认时出现
  target: { user_id, nickname },   // 能确认时出现
  body: {
    summary: 'QQ 客户端可见的系统提示',
    participants: [{ user_id, nickname }]
  }
}
```

框架从 QQ 原生系统卡片中提取可读摘要和已确认的参与人，不把易变化的 XML 当作公共参数。某个字段无法从本次推送确认时会省略，不会填入 `0` 或猜测内容。

v2.0.6 修复删除按“管理员”“群名片”“群名”“头衔”“精华”“上传文件”“戳”等文字猜测专用类型的逻辑。仅有摘要的系统卡片统一发送为 `group_system_tip`，不会产生缺少 `body.card`、`body.title`、`body.file_id` 等必要字段的专用事件。完整原生通知仍优先走专用解析；已识别的禁言、入群申请伴随卡片不重复生成事件。

已验证的表情回应伴随提示只发给消息作者的在线协议，不含无法确认的操作者；回应事件按原生结构提供序号、表情与添加/取消状态。该真实模板的验证不代表其他客户端任意卡片都能解析。

## 群文件上传（v2.0.6）

目录读取对有歧义的末页扩大窗口并校验前缀，满 100 条时采用重叠窗口确认尾部；视图不一致或无法确认完整性时返回错误。总条目上限 10000，整次读取预算 45 秒。99/100/101 条边界及混合文件/目录已交叉验证，不承诺无限目录或持续并发修改仍能获得一致快照。详见[目录分页与完整性](/api/get_group_files_by_folder.html#分页与完整性)。

`group_file_uploaded` 的 `group_id` 表示目标群，`operator.user_id` 是经服务端文件列表确认的上传者。完整文件消息包含 `body.file_id`、`file_name`、`file_size`、`busid`，以及消息本身提供的字段。

部分会话只收到原生目录变更提示。框架在收到提示后回读真实文件列表及子目录，确认本次账号在线期间新出现的上传，才产生事件；不会根据上传 API 成功响应伪造通知。此路径额外提供 `body.upload_time`（秒）和 `body.parent_folder_id`，不提供无法确认的 `msg_seq`。同一账号/协议运行期按群和文件 ID 去重，重复提示不重复投递；回读失败或列表不完整不会当作成功处理，也不会重播上线之前的历史文件。

v2.0.6在文件动态提交后，主动唤醒上传者当时已在线的各协议会话，由它们独立回读服务器目录；其他会话确认新文件后，也可以唤醒对应上传者。上传响应不会直接变成事件，回读仍须校验完整服务器数据。该路径标记顶层 `source: "server_readback"` 和毫秒级 `confirmed_at`。上传提交未进入动态提交阶段时不启动此确认；动态响应丢失也只回读，不重试上传。提交前捕获登录代次，旧上传完成不能唤醒重登后的会话。

已验证上传者与接收者、接收方离线时上传者独立确认、重登不重放，以及双账号、双协议、两节点、三 WS 的交叉上传和反向重连。未知完整文件通知模板、外部无目录提示的上传和长期高负载未包含在该实测范围内。

目录回读任务绑定到账号的本次登录：离线或重登取消旧任务，迟到响应不得继续重试、修改新登录的去重记录或提交旧事件。已发出的底层请求可能仍等待响应或超时，但结果不会跨登录生效。离线期间上传的文件可从目录 API 查询，不会在重登后当成新上传重复广播。

事件目录回读与群属性回读共享最多 8 个在途查询名额，等待名额也计入超时。一次文件树确认（含重试）总预算为 45 秒；一次群属性变更的所有观察账号共用 15 秒确认预算。超时会记录回读失败，不虚构变化；这不是全部账号必达的保证，也不限制插件主动调用的普通目录查询。

## 群禁言

```js
api.on('group_member_muted', event => {
  console.log(event.target.user_id, event.body.duration)
})
```

```js
{
  group_id,
  group_name,
  operator: { user_id, nickname },
  target: { user_id, nickname },
  body: {
    duration: 600,
    status: true
  }
}
```

`duration` 单位为秒，`0` 表示解除禁言；`status` 表示事件发生后的禁言状态。

## 消息撤回

### group_message_recalled

```js
{
  group_id,
  group_name,
  operator: { user_id, nickname },
  target: { user_id, nickname },
  body: {
    msg_seq,
    msg_time,
    msg_random,
    prompt_text,
    original
  }
}
```

`original` 仅在框架缓存仍保存该消息时出现，包含原发送者、结构化消息段和文本摘要。

### friend_message_recalled

好友撤回事件包含 `operator` 和 `body`；`body` 中返回本次原生推送能够确认的消息标识。好友消息未进入框架缓存或 QQ 未返回原消息时不生成虚假的 `original`。

好友撤回包含以下原生消息标识；`msg_seq` 和 `client_seq` 均不是可直接传给 `delete_msg` 的公共 `message_id`。

| 字段 | 含义 |
| --- | --- |
| `body.msg_seq` | 服务端消息序号，对应发送响应中的 `msg_seq` |
| `body.client_seq` | 客户端序号，对应私聊原生消息回推的 `msg.seq` |
| `body.msg_random` | 消息随机标识，与客户端序号共同关联原消息 |
| `body.from_uid` / `body.to_uid` | 原生确认的发送方与接收方 UID |
| `body.prompt_text` | 存在时返回的撤回提示文案，不能视为服务端错误 |

同一 QQ 的不同协议会话可能分别收到通知。插件应结合 `self_id`、`client_type`、双方 UID 和消息标识处理，不能只用一个序号跨账号匹配。API 成功响应和原生撤回事件是两个独立结果；框架不会据 API 响应伪造事件。

## 好友关系与互动

### friend_added

v2.0.6在收到服务器原生好友关系确认通知后发送，`operator` 是新好友（含可确认的 `user_id`、`uid`、`nickname`）。`body.source` 固定为 `native_push`，`body.time` 是服务器确认时间（Unix 秒）。同一账号、协议重复收到同一通知时短时去重；不同协议、账号各自投递，不互相吞掉。

不再因“同意申请”API 返回成功直接生成此事件。`friend_added` 不包含申请 `flag`；需要处理申请时，应使用 `friend_request_received.flag`。API 成功、好友列表回读和事件到达是三个独立验证项。

### profile_liked

```js
{
  operator: { user_id, nickname },
  body: { text: '赞了我的资料卡1次', count: 1, count_source: 'native_text' }
}
```

v2.0.6用原生通知类型识别资料点赞，不依赖提示里是否出现“戳”或“正在输入”。修复了把通知内部固定值 `2` 当作点赞次数的问题。

`text` 保留服务器原文。当前原生通知的数量来自已验证的“赞了我的资料卡N次”模板，所以附带 `count_source: 'native_text'`；`count` 表示本次次数，不是累计获赞。遇到未识别模板或无效数量时不返回 `count` 和 `count_source`，插件应显示原文，不应把字段缺失视为 0 次或固定 2 次。此修复由 v2.0.6 提供。

### typing_status_changed

`operator` 表示状态来源好友。原生输入状态通知提供 `body.state`（保留原始状态码）、`body.from_uid`、`body.to_uid`，以及存在时的 `body.text`。已验证 `state=1` 开始、`state=0` 停止；不要把所有非零状态都当作正在输入，也不要依靠文本判断状态。

开始/停止状态已通过两个账号跨节点、双正向 WS 实测。Linux 发起、接收方 Android/Linux 同时在线的交叉测试也已通过：状态只描述发起者，双 WS 的事件 ID 与内容一致。不将发送接口成功当作接收事件的证据。

### user_poked

在群聊中会同时包含 `group_id`、`operator` 和 `target`；好友场景至少包含已确认的发起者。无法确认目标时不补猜测账号。

框架按原生互动模板解析群聊与私聊戳一戳，提供已确认的 `operator`、`target` 和 `body.action`、`body.suffix`。`action` 可以是“拍了拍”、自定义文案或其他语言，插件不应通过其中是否包含“戳”字判定事件。私聊没有 `group_id`，使用 `friend_event` 权限；群内使用 `group_event`。

群内和私聊戳一戳已通过两个 Linux 测试账号相互发起、双方 Android/Linux 会话接收、双正向 WS 投递的交叉验证，逐条核对操作者和目标账号。

精华事件的 `msg_seq`、`msg_random` 是原生标识，不是公共 `message_id`。需要调用精华操作时，请从当前账号收到、发送或回读的群消息获取公共引用。v2.0.6修复旧查询返回 `12002`、Linux 在线却因缺少 Android SKey 无法查询的问题。两个 QQ 的 Android/Linux 会话已完成设置、查询、取消和再次查询验证；原生推送的操作类型、消息序号、随机标识、操作者及双 WS 一致性分别校验通过。其他未覆盖事件不据此宣称通过。
