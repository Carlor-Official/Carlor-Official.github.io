# API 总览

正向与反向 WebSocket SDK 提供相同的 API。除特别注明外，所有 API 都返回 Promise，成功时解析为业务数据，失败时抛出错误。

::: tip 当前运行契约
本文档沿用萌卡 NT 官方 API 参考。请使用与目标框架 Release 相匹配的 SDK；管理能力通过 `get_plugin_context().available_actions` 查询，不要仅凭官网列表假设目标实例已支持全部功能。QQ 宠物接口使用对象参数；已删除的旧服务字段和旧 action 不恢复兼容。
:::

::: warning 2.0 管理 API 切割
插件服务通过框架 Token 认证后可直接调用管理 API。`system_management` 和 `allowed_actions` 已从服务配置与返回契约删除；`admin_base_url` 只用于管理员 SSO 和管理端入口，不参与 API 授权。插件应检查 `get_plugin_context().management_api_version === 1`，不得降级调用已删除的旧接口。
:::

### 选择 Android 或 Linux QQ

v2.0.6 新增 [主动申请加好友](/api/send_friend_request.html)、[主动申请入群](/api/send_group_join_request.html)、[主动退群](/api/leave_group.html)、[修改群名](/api/set_group_name.html)、[设置精华消息](/api/set_group_essence.html)、[戳一戳](/api/send_poke.html)。旧 v2.0.5 不支持这些接口；各协议及实测范围以详情页为准。

官方 SDK 推荐先创建协议作用域，再调用对应方法；QQ 宠物接口使用对象参数，具体见各接口详情：

```js
const androidApi = api.forProtocol('android')
const linuxApi = api.forProtocol('linuxqq')

await linuxApi.send_group_msg(self_id, group_id, message)
```

直接发送账号 action 时，显式使用 `client_type: 'android' | 'linuxqq'`。SDK 无协议作用域的便捷方法默认选择 Android；不要依赖原始请求省略协议，新 action 会拒绝缺少协议的请求，同一 QQ 双协议在线也不会自动切换会话。

Linux QQ 账号仍通过统一的 `/api/v1/accounts` 创建和管理。控制台登录时，由框架调用 `/api/v1/accounts/:self_id/sso/WTLoginQRCode` 创建二维码，再通过 `/api/v1/accounts/:self_id/sso/WTLoginQRCodeQuery` 查询状态；这两个接口属于登录后的管理端 REST 链路，不是插件 WebSocket action。不要使用 `scan_qr`、`auth_qr` 或 Android 安全验证二维码接口代替 Linux 登录链路。

### 插件调用与事件

`send_packet` 是普通 API，已认证的正向、反向及托管插件均可调用，无需白名单或专属 Key。服务 Token、参数和账号权限检查继续生效。新插件可从 [Node.js SDK](/development/nodejs-sdk.html) 接入。

当前原生事件共 26 类，包含账号上线、离线、申请、消息与结构化通知。事件按账号实际节点产生，按插件订阅权限投递；WS 不绑定固定节点。正向 SDK v2.1.12 支持显式声明 `permissions.group_event`；表情回应请监听 `message_reaction_changed`。API 成功不等于事件已到达，断线不保证补发，详见[事件目录与可靠性](/events/)。

## 系统信息

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取登录信息](/api/get_login_info.html) | Android / Linux 双协议可用 | 读取当前账号 ID、昵称和客户端类型 |
| [获取运行状态](/api/get_status.html) | Android / Linux 双协议可用 | 读取当前账号连接状态与本地收发统计 |
| [获取版本信息](/api/get_version_info.html) | Android / Linux 双协议可用 | 读取萌卡 NT 和插件协议版本 |
| [检查图片发送能力](/api/can_send_image.html) | Android / Linux 双协议可用 | 查询当前账号平台是否支持图片发送 |
| [检查语音发送能力](/api/can_send_record.html) | Android / Linux 双协议可用 | 查询当前账号平台是否支持语音发送 |
| [下载文件](/api/download_file.html) | Android / Linux 双协议可用 | 将公网 HTTP/HTTPS 文件安全下载到框架隔离目录 |
| [上传文件流](/api/upload_file_stream.html) | Android / Linux 双协议可用 | 分片上传文件到框架临时目录 |
| [清理流临时文件](/api/clean_stream_temp_file.html) | Android / Linux 双协议可用 | 清理上传流状态与临时文件 |
| [测试流式传输](/api/test_download_stream.html) | Android / Linux 双协议可用 | 发送十个测试分片并返回完成结果 |
| [流式下载文件](/api/download_file_stream.html) | Android / Linux 双协议可用 | 通过分片帧下载文件 |
| [流式下载图片](/api/download_file_image_stream.html) | Android / Linux 双协议可用 | 通过分片帧下载图片并返回宽高 |
| [流式下载语音](/api/download_file_record_stream.html) | Android / Linux 双协议可用 | 通过分片帧下载语音并可转换格式 |
| [获取在线客户端](/api/get_online_clients.html) | Android / Linux 双协议可用 | 返回账号在线设备列表 |
| [设置在线状态](/api/set_online_status.html) | Android 协议可用 | 设置在线、离开、忙碌、隐身及扩展状态 |
| [设置自定义在线状态](/api/set_diy_online_status.html) | Android 协议可用 | 设置自定义状态图标和文字 |
| [设置正在输入状态](/api/set_input_status.html) | Android 协议可用 | 向指定好友同步正在输入或结束输入状态 |
| [获取用户在线状态](/api/nc_get_user_status.html) | Android / Linux 双协议可用 | 查询指定 QQ 当前的在线状态与扩展状态 |
| [重启框架服务](/api/set_restart.html) | Android / Linux 双协议可用 | 保留账号缓存会话并重启当前框架进程 |
| [检查网址安全性](/api/check_url_safely.html) | Android / Linux 双协议可用 | 由 QQ Android 服务返回安全、未知或危险等级 |
| [英文翻译为中文](/api/translate_en2zh.html) | Android / Linux 双协议可用 | 调用 QQ Android 批量翻译服务 |
| [发送原始协议包](/api/send_packet.html) | Android 协议可用 | 使用当前账号会话发送已组装的原生协议包 |
| [获取在线机型显示](/api/get_model_show.html) | Android 协议可用 | 使用账号会话和设备指纹查询 QQ 服务端可用机型名称 |
| [设置在线机型显示](/api/set_model_show.html) | Android 协议可用 | 设置在线机型名称，或恢复 QQ 默认显示 |

## 消息与媒体

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [发送群聊消息](/api/send_group_msg.html) | Android / Linux 双协议可用 | 向指定群聊发送消息 |
| [发送好友消息](/api/send_friend_msg.html) | Android / Linux 双协议可用 | 向指定好友发送消息 |
| [发送消息](/api/send_msg.html) | Android / Linux 双协议可用 | 按好友或群聊目标复用现有消息发送链路 |
| [获取群聊历史消息](/api/get_group_msg_history.html) | Android / Linux 双协议可用 | 从 QQ 服务器按消息序号分页读取群聊历史消息 |
| [获取好友历史消息](/api/get_friend_msg_history.html) | Android / Linux 双协议可用 | 从 QQ 服务器按消息时间分页读取好友漫游消息 |
| [转发单条好友消息](/api/forward_friend_single_msg.html) | Android 协议可用 | 将进程内缓存消息重新发送给指定好友 |
| [转发单条群消息](/api/forward_group_single_msg.html) | Android 协议可用 | 将进程内缓存消息重新发送到指定群聊 |
| [上传好友图片](/api/upload_friend_image.html) | Android / Linux 双协议可用 | 上传好友聊天图片 |
| [设置 QQ 头像](/api/set_qq_avatar.html) | Android 协议可用 | 通过 Highway 上传当前 Bot 头像 |
| [上传群聊图片](/api/upload_group_image.html) | Android / Linux 双协议可用 | 上传图片并生成图片消息段 |
| [上传群聊语音](/api/upload_group_voice.html) | Android / Linux 双协议可用 | 上传音频并生成语音消息段 |
| [上传群聊视频](/api/upload_group_video.html) | Android / Linux 双协议可用 | 上传 MP4 视频并生成视频消息段 |
| [获取群聊合并转发消息](/api/get_group_forward_msg.html) | Android / Linux 双协议可用 | 获取合并转发的完整内容 |
| [获取合并转发消息](/api/get_forward_msg.html) | Android / Linux 双协议可用 | 从消息 ID 或资源 ID 获取合并转发节点 |
| [发送群聊合并转发消息](/api/send_group_forward_msg.html) | Android / Linux 双协议可用 | 创建文本合并转发消息 |
| [生成好友分享 Ark](/api/ArkSharePeer.html) | Android 协议可用 | 根据现有好友资料生成联系人分享 Ark |
| [生成好友分享 Ark（通用 action）](/api/send_ark_share.html) | Android 协议可用 | 与 `ArkSharePeer` 使用同一套萌卡原生处理链路 |
| [生成群聊分享 Ark](/api/ArkShareGroup.html) | Android 协议可用 | 根据现有群资料生成群聊分享 Ark |
| [生成群聊分享 Ark（通用 action）](/api/send_group_ark_share.html) | Android 协议可用 | 与 `ArkShareGroup` 使用同一套萌卡原生处理链路 |
| [发送群红包](/api/send_group_red_packet.html) | Android 协议可用 | 发送拼手气、普通、专属、语音或口令群红包 |
| [查询红包详细信息](/api/get_red_packet_info.html) | Android 协议可用 | 查询收到的 QQ 红包状态与金额信息 |
| [领取红包](/api/grab_red_packet.html) | Android 协议可用 | 领取收到的 QQ 群红包 |
| [获取群聊可领取红包](/api/get_group_red_packets.html) | Android 协议可用 | 获取指定群聊中当前仍可领取的红包 |
| [获取可领取红包](/api/get_up_for_grabs.html) | Android 协议可用 | 与群聊可领取红包查询使用同一套萌卡原生处理链路 |
| [获取消息](/api/get_msg.html) | Android / Linux 双协议可用 | 读取框架保留的标准消息引用和消息段 |
| [获取闪照原图地址](/api/get_flash_image.html) | Android 协议可用 | 读取当前账号实时收到的闪照原图地址与图片信息 |
| [生成音乐 Ark 卡片](/api/get_music_ark.html) | Android 协议可用 | 根据 QQ 或网易云歌曲信息生成带内容绑定签名的可播放音乐卡片 |
| [分页获取消息表情回应](/api/fetch_emoji_like.html) | Android 协议可用 | 分页获取指定群消息的表情回应用户 |
| [获取全部消息表情回应](/api/get_emoji_likes.html) | Android 协议可用 | 自动翻页获取指定群消息的全部表情回应用户 |
| [发送私聊消息](/api/send_private_msg.html) | Android / Linux 双协议可用 | 按用户 ID 使用萌卡原生好友消息链路发送消息 |
| [发送群临时会话消息](/api/send_group_temp_msg.html) | Android / Linux 双协议可用 | 通过共同群聊向非好友群成员发起临时私聊 |
| [撤回消息](/api/delete_msg.html) | Android / Linux 双协议可用 | 根据消息引用自动分派群聊或私聊撤回 |
| [标记群聊已读](/api/mark_group_msg_as_read.html) | Android / Linux 双协议可用 | 将指定群消息序号作为群聊已读游标上报 |
| [标记私聊已读](/api/mark_private_msg_as_read.html) | Android / Linux 双协议可用 | 将指定好友消息时间作为私聊已读游标上报 |
| [标记消息已读](/api/mark_msg_as_read.html) | Android / Linux 双协议可用 | 自动识别群聊或私聊并上报已读游标 |
| [设置群头像](/api/set_group_portrait.html) | Android 协议可用 | 按 QQ Android 9.2.70 的真实上传链路设置群聊头像 |
| [上传私聊文件](/api/upload_private_file.html) | Android / Linux 双协议可用 | 通过 QQ Android 9.2.70 离线文件通道向好友发送文件 |
| [发送合并转发消息](/api/send_forward_msg.html) | Android / Linux 双协议可用 | 按 `user_id` 或 `group_id` 自动选择私聊或群聊目标 |
| [发送私聊合并转发消息](/api/send_private_forward_msg.html) | Android / Linux 双协议可用 | 创建文本合并转发消息并发送给指定好友 |
| [生成小程序 Ark 卡片](/api/get_mini_app_ark.html) | Android 协议可用 | 生成可发送的小程序 Ark 数据 |
| [获取 AI 声音角色](/api/get_ai_characters.html) | Android 协议可用 | 获取群聊可用的 AI 声音角色列表 |
| [生成 AI 语音](/api/get_ai_record.html) | Android 协议可用 | 合成 AI 语音并返回可访问地址 |
| [发送群聊 AI 语音](/api/send_group_ai_record.html) | Android 协议可用 | 合成并直接发送群聊 AI 语音 |
| [识别语音文字](/api/fetch_ptt_text.html) | Android 协议可用 | 识别框架消息缓存中的群语音 |
| [设置消息表情回应](/api/set_msg_emoji_like.html) | Android 协议可用 | 添加或取消群消息表情回应 |
| [标记所有消息已读](/api/mark_all_as_read.html) | Android / Linux 双协议可用 | 批量上报框架近期缓存的最新会话游标 |
| [处理事件快速操作](/api/handle_quick_operation.html) | Android 协议可用 | 根据消息或申请事件上下文执行回复、撤回、群管理和申请处理 |

## 好友与空间

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取好友列表](/api/get_friend_list.html) | Android / Linux 双协议可用 | 获取完整好友列表 |
| [获取单向好友列表](/api/get_unidirectional_friend_list.html) | Android 协议可用 | 获取当前账号的真实单向好友关系 |
| [获取资料获赞](/api/get_profile_like.html) | Android 协议可用 | 获取当前登录 QQ 的真实资料获赞记录与统计 |
| [获取可疑好友申请](/api/get_doubt_friends_add_request.html) | Android 协议可用 | 获取 QQ 标记为可疑的待处理好友申请 |
| [删除好友](/api/delete_friend.html) | Android 协议可用 | 删除指定好友 |
| [获取好友动态](/api/get_qzone_friend_feeds.html) | Android 协议可用 | 获取好友空间最新动态 |
| [发布空间动态](/api/publish_qzone_feed.html) | Android 协议可用 | 发布一条文本空间动态 |
| [点赞好友动态](/api/like_qzone_feed.html) | Android 协议可用 | 点赞指定动态 |
| [取消好友动态点赞](/api/unlike_qzone_feed.html) | Android 协议可用 | 取消指定动态的点赞 |
| [获取 QQ 名片](/api/get_summary_card.html) | Android / Linux 双协议可用 | 获取自己或指定用户的 QQ 名片 |
| [点赞 QQ 名片](/api/like_summary_card.html) | Android / Linux 双协议可用 | 点赞指定用户的 QQ 名片 |
| [获取 skey](/api/get_skey.html) | Android 协议可用 | 获取当前 Bot 的 skey |
| [获取 User-Agent](/api/get_user_agent.html) | Android / Linux 双协议可用 | 获取当前 Bot 协议和设备指纹对应的 User-Agent |
| [获取 clientkey](/api/get_clientkey.html) | Android 协议可用 | 获取十六进制 clientkey |
| [获取 PsKey](/api/get_pskey.html) | Android / Linux 双协议可用 | 获取指定域名的 PsKey |
| [获取媒体 RKey](/api/get_rkey.html) | Android 协议可用 | 读取框架后台已维护的媒体 RKey 缓存 |
| [获取媒体 RKey（通用 action）](/api/nc_get_rkey.html) | Android 协议可用 | 与 `get_rkey` 使用同一套萌卡原生缓存 |
| [获取媒体 RKey 服务信息](/api/get_rkey_server.html) | Android 协议可用 | 读取私聊、群聊 RKey 与统一过期时间 |
| [获取最近会话](/api/get_recent_contact.html) | Android 协议可用 | 获取框架近期观察到的私聊与群聊会话 |
| [设置好友备注](/api/set_friend_remark.html) | Android 协议可用 | 设置或清除指定好友的备注 |
| [处理好友申请](/api/set_friend_add_request.html) | Android / Linux 双协议可用 | 同意或拒绝好友申请，可在同意时设置备注 |
| [主动申请加好友](/api/send_friend_request.html) | Android / Linux 双协议可用 | 提交好友申请，不等同于好友关系已建立 |
| [主动申请入群](/api/send_group_join_request.html) | Android 协议可用 | Android 提交入群说明，不等同于账号已入群 |
| [主动退群](/api/leave_group.html) | Android / Linux 双协议可用 | 当前账号退出群聊，禁止群主调用，不提供解散群能力 |
| [修改群名](/api/set_group_name.html) | Android / Linux 双协议可用 | 设置群名称，以服务器确认及通知为准 |
| [设置精华消息](/api/set_group_essence.html) | Android / Linux 双协议可用 | 设置或取消已缓存群消息的精华状态 |
| [戳一戳](/api/send_poke.html) | Android / Linux 双协议可用 | 向好友或群成员发送普通戳一戳 |
| [处理可疑好友申请](/api/set_doubt_friends_add_request.html) | Android 协议可用 | 同意指定可疑好友申请 |
| [发布空间动态（完整参数）](/api/send_qzone_msg.html) | Android 协议可用 | 发布带图片、可见范围和指定好友范围的空间动态 |
| [删除空间动态](/api/delete_qzone_msg.html) | Android 协议可用 | 按动态 tid 删除本人空间动态 |
| [评论好友动态](/api/comment_qzone_feed.html) | Android 协议可用 | 评论指定动态 |
| [设置 QQ 资料](/api/set_qq_profile.html) | Android 协议可用 | 设置当前账号昵称、性别和个性签名，并回读最新名片 |
| [设置 QQ 个性签名](/api/set_self_longnick.html) | Android 协议可用 | 按 QQ Android 9.2.70 的审核与保存链路设置或清空当前账号签名 |

## 群聊管理

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取群聊列表](/api/get_group_list.html) | Android / Linux 双协议可用 | 获取完整群聊列表 |
| [获取群聊成员列表](/api/get_group_member_list.html) | Android / Linux 双协议可用 | 获取指定群聊的成员 |
| [获取群聊系统通知](/api/get_group_system_notifications.html) | Android 协议可用 | 获取群聊申请与通知 |
| [同意加入群聊申请](/api/approve_group_apply.html) | Android 协议可用 | 同意指定申请 |
| [拒绝加入群聊申请](/api/reject_group_apply.html) | Android 协议可用 | 拒绝指定申请 |
| [同意群聊邀请](/api/approve_group_invite.html) | Android 协议可用 | 同意好友发来的群聊邀请 |
| [设置群聊管理员](/api/set_group_admin.html) | Android / Linux 双协议可用 | 设置或取消管理员 |
| [群聊打卡](/api/group_sign.html) | Android 协议可用 | 在指定群聊打卡 |
| [设置群聊成员禁言](/api/set_group_mute.html) | Android / Linux 双协议可用 | 设置或取消成员禁言 |
| [设置群聊全员禁言](/api/set_group_mute_all.html) | Android / Linux 双协议可用 | 开启或取消全员禁言 |
| [设置群聊专属头衔](/api/set_group_special_title.html) | Android / Linux 双协议可用 | 设置或清除成员专属头衔 |
| [移出群聊成员](/api/kick_group_member.html) | Android / Linux 双协议可用 | 将指定成员移出群聊 |
| [批量移出群聊成员](/api/set_group_kick_members.html) | Android / Linux 双协议可用 | 按顺序复用单人移出链路，单次最多 20 人 |
| [撤回群聊消息](/api/recall_group_msg.html) | Android / Linux 双协议可用 | 撤回指定群聊消息 |
| [获取 @全体成员 剩余次数](/api/get_group_at_all_remain.html) | Android 协议可用 | 查询当前账号和群聊的实时 @全体成员权限与限额 |
| [获取群荣誉信息](/api/get_group_honor_info.html) | Android 协议可用 | 获取龙王、群聊之火、群聊炽焰和快乐源泉榜单 |
| [获取群精华消息](/api/get_essence_msg_list.html) | Android / Linux 双协议可用 | 获取指定群聊的精华消息列表 |
| [获取群组今日打卡列表](/api/get_group_signed_list.html) | Android 协议可用 | 获取群聊当天的打卡成员和排名 |
| [获取群文件系统信息](/api/get_group_file_system_info.html) | Android 协议可用 | 获取文件数量限制和存储空间使用情况 |
| [创建群聊](/api/create_group.html) | Android 协议可用 | 创建普通 QQ 群，并可在创建成功后邀请成员 |
| [设置成员邀请策略](/api/set_group_member_invite_policy.html) | Android 协议可用 | 控制普通成员能否直接邀请他人入群 |
| [设置成员权限](/api/set_group_member_permissions.html) | Android 协议可用 | 单独开启或关闭成员邀请、上传等权限位 |
| [设置新成员历史消息可见性](/api/set_group_new_member_history_visibility.html) | Android 协议可用 | 控制新成员是否能查看入群前历史消息 |
| [设置群加群选项](/api/set_group_add_option.html) | Android 协议可用 | 设置入群验证方式、问题与答案 |
| [设置群搜索选项](/api/set_group_search.html) | Android 协议可用 | 设置群号和条件搜索开关 |
| [设置机器人入群选项](/api/set_group_robot_add_option.html) | Android 协议可用 | 设置机器人账号入群时是否允许及是否需要审核 |
| [获取群相册列表](/api/get_qun_album_list.html) | Android 协议可用 | 分页获取群相册及封面信息 |
| [获取群相册媒体列表](/api/get_group_album_media_list.html) | Android 协议可用 | 分页获取相册内的图片和视频 |
| [上传图片到群相册](/api/upload_image_to_qun_album.html) | Android 协议可用 | 使用当前 Android QQ 登录态分片上传图片 |
| [评论群相册媒体](/api/do_group_album_comment.html) | Android 协议可用 | 评论指定相册图片或视频 |
| [点赞群相册媒体](/api/set_group_album_media_like.html) | Android 协议可用 | 点赞一批或指定相册媒体 |
| [取消群相册媒体点赞](/api/cancel_group_album_media_like.html) | Android 协议可用 | 取消一批或指定相册媒体的点赞 |
| [删除群相册媒体](/api/del_group_album_media.html) | Android 协议可用 | 删除相册图片或视频 |
| [获取群文件根目录](/api/get_group_root_files.html) | Android / Linux 双协议可用 | 获取根目录文件与文件夹，并自动处理分页 |
| [获取群文件夹内容](/api/get_group_files_by_folder.html) | Android / Linux 双协议可用 | 获取指定文件夹中的文件与子文件夹 |
| [创建群文件夹](/api/create_group_file_folder.html) | Android 协议可用 | 由群主或管理员在根目录创建文件夹 |
| [删除群文件夹](/api/delete_group_folder.html) | Android 协议可用 | 按真实文件夹 ID 删除群文件夹 |
| [上传群文件](/api/upload_group_file.html) | Android / Linux 双协议可用 | 通过 QQ Android 9.2.70 文件通道真实上传群文件 |
| [删除群文件](/api/delete_group_file.html) | Android 协议可用 | 删除群文件，缺省业务参数由框架自动查询补齐 |
| [重命名群文件](/api/rename_group_file.html) | Android 协议可用 | 按文件 ID 重命名群文件 |
| [移动群文件](/api/move_group_file.html) | Android 协议可用 | 在群文件目录之间移动文件 |
| [修改群成员名片](/api/set_group_card.html) | Android / Linux 双协议可用 | 修改或清空指定成员在群内显示的昵称 |
| [获取群公告](/api/get_group_notice.html) | Android 协议可用 | 使用当前 Android QQ 登录态获取群公告 |
| [发布群公告](/api/send_group_notice.html) | Android 协议可用 | 发布文字公告，并可附带本地、URL 或 Base64 图片 |
| [删除群公告](/api/del_group_notice.html) | Android 协议可用 | 删除指定群聊中的公告 |

## 账号、登录与等级任务

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取 Bot 列表](/api/get_bot_list.html) | Android / Linux 双协议可用 | 获取当前框架实例中的全部协议账号；不接受参数 |
| [获取 Bot 信息](/api/get_bot_info.html) | Android / Linux 双协议可用 | 获取指定 Bot 的运行信息 |
| [获取协议列表](/api/get_protocol_list.html) | Android / Linux 双协议可用 | 获取可选协议 |
| [获取设备指纹列表](/api/get_device_profile_list.html) | Android / Linux 双协议可用 | 获取可选设备指纹 |
| [添加账号](/api/add_account.html) | Android / Linux 双协议可用 | 创建账号并指定其登录节点 |
| [编辑账号](/api/update_account.html) | Android / Linux 双协议可用 | 编辑离线账号配置 |
| [停止账号会话](/api/stop_account_login.html) | Android / Linux 双协议可用 | 取消正在进行的登录，或下线已登录账号 |
| [删除账号](/api/delete_account.html) | Android / Linux 双协议可用 | 删除指定协议的离线账号 |
| [密码登录](/api/login_account.html) | Android / Linux 双协议可用 | 发起密码登录 |
| [检查登录缓存](/api/check_cache.html) | Android / Linux 双协议可用 | 检查本地登录缓存 |
| [缓存登录](/api/cache_login.html) | Android / Linux 双协议可用 | 使用本地缓存登录 |
| [提交滑块验证](/api/submit_slider.html) | Android 协议可用 | 提交滑块结果 |
| [查询安全验证方式](/api/get_security_verify_methods.html) | Android 协议可用 | 查询安全验证原因与可用方式 |
| [创建登录二维码](/api/create_login_qr.html) | Android / Linux 双协议可用 | 创建安全验证登录二维码 |
| [查询登录二维码状态](/api/query_login_qr_status.html) | Android / Linux 双协议可用 | 查询扫码状态并在确认后继续登录 |
| [获取短信验证码](/api/get_sms.html) | Android 协议可用 | 下发安全验证短信 |
| [提交短信验证码](/api/check_sms.html) | Android 协议可用 | 提交短信验证码并继续登录 |
| [Android 扫描登录二维码](/api/scan_qr.html) | Android 协议可用 | 使用在线 Android Bot 扫描登录二维码 |
| [Android 授权登录二维码](/api/auth_qr.html) | Android 协议可用 | 使用在线 Android Bot 确认二维码授权 |
| [获取等级加速任务](/api/get_level_tasks.html) | Android 协议可用 | 获取 QQ 等级加速面板 |
| [执行等级加速任务](/api/execute_level_tasks.html) | Android 协议可用 | 执行指定的等级加速任务 |
| [获取等级加速账号列表](/api/get_level_task_accounts.html) | Android / Linux 双协议可用 | 获取框架共享等级任务账号及协议支持情况 |
| [获取等级加速账号详情](/api/get_level_task_account.html) | Android 协议可用 | 读取单个账号的共享任务状态 |
| [获取等级加速面板](/api/get_level_task_panel.html) | Android 协议可用 | 刷新或读取共享任务面板 |
| [读取等级任务计划](/api/get_level_task_settings.html) | Android 协议可用 | 读取框架统一调度配置 |
| [保存等级任务计划](/api/update_level_task_settings.html) | Android 协议可用 | 保存计划，不立即执行 |
| [执行选定等级任务](/api/execute_level_task_selection.html) | Android 协议可用 | 复用框架执行过滤、缓存与并发控制 |
| [注册滑块验证反代](/api/register_captcha_proxy.html) | Android / Linux 双协议可用 | 注册滑块反代并返回改写后的验证脚本 |
| [滑块验证反代请求](/api/captcha_proxy.html) | Android / Linux 双协议可用 | 反代转发滑块请求到腾讯验证服务 |

## 框架服务管理

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取插件上下文](/api/get_plugin_context.html) | Android / Linux 双协议可用 | 读取当前服务、节点、契约版本、可用管理 action 与管理端地址 |
| [获取账号管理上下文](/api/get_account_management_context.html) | Android / Linux 双协议可用 | 一次读取账号、协议、指纹和节点快照 |
| [创建账号归属验证二维码](/api/create_account_recovery_qr.html) | Android / Linux 双协议可用 | 创建只用于证明 QQ 归属的临时二维码 |
| [查询账号归属验证](/api/query_account_recovery_qr_status.html) | Android / Linux 双协议可用 | 查询扫码状态，确认后只返回 QQ 号 |
| [获取节点列表](/api/get_node_list.html) | Android / Linux 双协议可用 | 获取全部节点及账号统计，不返回代理密码 |
| [创建节点](/api/create_node.html) | Android / Linux 双协议可用 | 创建直连或 HTTP/SOCKS5 代理节点 |
| [更新节点](/api/update_node.html) | Android / Linux 双协议可用 | 更新已停用节点，代理密码支持保留或清除 |
| [删除节点](/api/delete_node.html) | Android / Linux 双协议可用 | 删除已停用且未被账号引用的节点 |
| [测试节点延迟](/api/test_node_latency.html) | Android / Linux 双协议可用 | 测试节点代理 TCP 连接延迟 |
| [创建设备指纹](/api/create_device_profile.html) | Android / Linux 双协议可用 | 创建可选自定义名称的随机设备指纹 |
| [删除设备指纹](/api/delete_device_profile.html) | Android / Linux 双协议可用 | 删除未被任何账号使用的设备指纹 |
| [获取账号设置](/api/get_account_settings.html) | Android / Linux 双协议可用 | 读取缓存登录、自动登录和离线清理设置 |
| [更新账号设置](/api/update_account_settings.html) | Android / Linux 双协议可用 | 更新框架级账号设置并校验依赖关系 |
| [获取账号离线通知](/api/get_account_offline_notification.html) | Android / Linux 双协议可用 | 读取指定 QQ 与协议的离线邮件通知设置 |
| [更新账号离线通知](/api/update_account_offline_notification.html) | Android / Linux 双协议可用 | 更新指定 QQ 与协议的离线邮件通知设置 |
| [清理账号缓存](/api/clear_account_cache.html) | Android / Linux 双协议可用 | 清理指定 QQ 和协议的本地登录缓存 |
| [提交身份滑块](/api/submit_account_identity_captcha.html) | Android 协议可用 | 提交身份验证滑块结果 |
| [提交身份手机号](/api/submit_account_identity_phone.html) | Android 协议可用 | 提交身份验证手机号并请求短信 |
| [确认身份短信](/api/confirm_account_identity_sms.html) | Android 协议可用 | 确认身份验证短信已完成 |
| [重试身份验证登录](/api/retry_account_identity_verify.html) | Android 协议可用 | 使用验证结果重试账号登录 |
| [调用账号安全验证](/api/open_account_security_access.html) | Android 协议可用 | 调用指定 SsoSecureAccess 验证类型 |
| [重试安全验证登录](/api/retry_account_security_verify.html) | Android 协议可用 | 使用安全验证结果重试账号登录 |
| [获取账号授权租约](/api/get_account_access_list.html) | Android / Linux 双协议可用 | 获取当前服务创建的账号授权租约 |
| [设置账号授权租约](/api/set_account_access.html) | Android / Linux 双协议可用 | 为指定 QQ 与协议创建或更新授权租约 |
| [清除账号授权租约](/api/clear_account_access.html) | Android / Linux 双协议可用 | 清除当前服务对指定 QQ 与协议的租约 |
| [获取账号最近日志](/api/get_account_recent_logs.html) | Android / Linux 双协议可用 | 获取指定 QQ 与协议最近 200 条账号日志 |

## QQ 宠物

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取宠物资料](/api/get_pet_profile.html) | Android 协议可用 | 获取本人宠物资料 |
| [获取宠物勋章图鉴](/api/get_pet_medal_gallery.html) | Android 协议可用 | 获取全部勋章及获得、佩戴状态 |
| [获取宠物数值](/api/get_pet_vitals.html) | Android 协议可用 | 根据 pet_id 获取本人或好友宠物的心情、饱腹、清洁和金币 |
| [获取宠物三维属性](/api/get_pet_attributes.html) | Android 协议可用 | 获取力量、智力、魅力等成长属性 |
| [获取食物目录](/api/get_pet_food_catalog.html) | Android 协议可用 | 获取食物目录与库存 |
| [给宠物喂食](/api/feed_pet.html) | Android 协议可用 | 使用指定名称或 ID 的食物喂食 |
| [购买宠物食物](/api/buy_pet_food.html) | Android 协议可用 | 按食物名称或 ID 购买宠物食物 |
| [获取洗护用品目录](/api/get_pet_bath_catalog.html) | Android 协议可用 | 获取洗护用品与价格 |
| [获取洗护用品库存](/api/get_pet_bath_inventory.html) | Android 协议可用 | 获取洗护用品持有数量 |
| [给宠物洗护](/api/bathe_pet.html) | Android 协议可用 | 按名称或 ID 使用洗护用品 |
| [购买洗护用品](/api/buy_pet_bath_item.html) | Android 协议可用 | 按名称或 ID 购买洗护用品 |
| [获取活动概览](/api/get_pet_activity_overview.html) | Android 协议可用 | 获取学习或打工概览 |
| [获取活动选项](/api/get_pet_activity_options.html) | Android 协议可用 | 获取可选课程、岗位或冒险 |
| [开始宠物活动](/api/start_pet_activity.html) | Android 协议可用 | 开始学习、打工或冒险 |
| [获取活动状态](/api/get_pet_activity_status.html) | Android 协议可用 | 获取当前活动状态 |
| [结算宠物活动](/api/settle_pet_activity.html) | Android 协议可用 | 结算当前活动 |
| [鼓励活动中的宠物](/api/encourage_pet_activity.html) | Android 协议可用 | 鼓励当前活动中的宠物 |
| [获取宠物疲劳状态](/api/get_pet_fatigue_status.html) | Android 协议可用 | 获取学习/打工目录下发的疲劳档位与收益倍率 |
| [获取 PK 好友列表](/api/get_pet_pk_friends.html) | Android 协议可用 | 获取可 PK 的好友 |
| [获取推荐 PK 对手](/api/get_pet_pk_strangers.html) | Android 协议可用 | 获取宠物服务推荐的陌生人对手 |
| [获取宠物互动消息](/api/get_pet_interaction_messages.html) | Android 协议可用 | 获取来访、投喂等互动动态 |
| [获取宠物 PK 数值](/api/get_pet_pk_power.html) | Android 协议可用 | 根据 pet_id 获取本人或好友宠物战力 |
| [戳一戳好友宠物](/api/poke_friend_pet.html) | Android 协议可用 | 与好友宠物互动 |
| [获取好友宠物资料](/api/get_friend_pet_profile.html) | Android 协议可用 | 获取好友宠物资料与当前数值 |
| [给好友宠物喂食](/api/feed_friend_pet.html) | Android 协议可用 | 使用指定食物给好友宠物喂食 |
| [给好友宠物洗护](/api/bathe_friend_pet.html) | Android 协议可用 | 使用指定用品给好友宠物洗护 |
| [访问好友宠物](/api/visit_friend_pet.html) | Android 协议可用 | 访问好友的宠物页面 |
| [发起宠物 PK](/api/start_pet_pk.html) | Android 协议可用 | 与指定好友的宠物开始 PK |
| [获取宠物 PK 状态](/api/get_pet_pk_status.html) | Android 协议可用 | 查询指定 PK 任务状态 |
| [结算宠物 PK](/api/settle_pet_pk.html) | Android 协议可用 | 结算指定 PK 任务 |

## QQ 农场

| API | 可用协议 | 说明 |
| --- | --- | --- |
| [获取 QQ 农场登录 code](/api/get_qq_farm_code.html) | Android 协议可用 | 获取一个新的 32 位 QQ 农场登录 code |

## 通用约定

- Bot 业务 API 的 `self_id` 是执行操作的在线 Bot QQ 号。
- 服务管理 API 由已通过服务 Token 认证的插件调用；不再使用 `system_management` 或 `allowed_actions`。账号类 API 的 `self_id` 为目标 QQ，并通过 `client_type` 选择 Android 或 Linux。
- 同一 QQ 可以同时存在 Android 与 Linux QQ 会话。推荐使用 `api.forProtocol('android' | 'linux')`；插件原始请求使用 `client_type` 选择协议。
- 省略协议选择器时固定使用 Android。Linux 不支持的 action 会返回明确错误，不会转交同 QQ 的 Android 实例。
- Android 密码、安全验证与 Linux QQ 原生扫码/票据登录是两套独立流程；不要混用登录 API、密码、协议 ID 或设备指纹。
- 插件服务不再绑定节点。普通账号 action 通过 `self_id + client_type` 找到账号，并在账号自己的登录节点上执行。
- `get_bot_list` 不接受 `all_nodes`；创建账号时必须给出账号的 `node_id`，编辑账号时可用 `node_id` 移动其登录节点。
- Bot API 通常要求目标 Bot 在线。
- SDK默认请求超时为 30 秒；红包与头像为 60 秒，语音、视频和批量等级任务为 5 分钟。
- 同一插件连接上的 API 会并发执行，当前每连接最多同时执行 16 个 action；响应可能乱序，但 SDK 会按请求 ID 解析对应 Promise。
- 连续 `await` 会由调用方形成串行；需要并发时先发起多个调用，再使用 `Promise.all`。
- `file_path` 中的本地路径由萌卡NT后端读取。插件与后端不在同一主机时，应传后端可访问的 HTTP(S) 地址。
