# 安卓协议端待验证 API 清单

这份清单用于 v1.6.0 开发阶段的协议评估，不代表接口已放弃。清单中的能力目前缺少可复现的安卓协议命令、响应结构或实机行为证据；取得证据后再决定协议实现和测试方式，避免照搬 PC 客户端接口后返回无效结果。

## 已明确存在客户端限制

- `ocr_image`
- `.ocr_image`

现有接口说明明确标注为 Windows 端能力。需要确认安卓 QQ 是否存在等价的本地 OCR 或服务端 OCR 请求；如有，请提供对应入口或请求线索。

## 群设置与群资料

- `set_group_robot_add_option`
- `get_group_signed_list`
- `get_group_at_all_remain`
- `set_group_portrait`

`create_group` 已按安卓 QQ 9.2.70 的 `OidbSvc.0x8a1_0` 创建请求和 `cmd0x8a1.RspBody` 响应结构实现；成员不嵌入创建包，而是在服务端返回公开群号后通过 `OidbSvc.0x758_1` 单独邀请。这样即使邀请阶段失败，也会保留已创建群的 `group_id`，避免调用方因重试生成重复群聊。`set_group_add_option`、`set_group_search`、`set_group_member_invite_policy`、`set_group_member_permissions` 和 `set_group_new_member_history_visibility` 已改用安卓 QQ 的 `0x88d_0` 群详情和 `0x89a_0` 群设置链路。涉及完整权限位的操作会先读取当前值、仅修改目标字段或掩码、提交后回读校验，避免覆盖其他群配置。`get_group_admin_settings` 使用同一条安卓群详情链路返回上述设置的当前值。`invite_group_member` 使用 Native `InviteGroupReq` 的入参语义，但按内核最终发送的 `cmd0x758.ReqBody/InviteUinInfo` 编码数值 QQ 号；踢人和其他成员权限联调也只使用 106606，避免影响无关账号。

`get_group_msg_history` 和 `get_friend_msg_history` 分别使用 9.2.70 APK 自带的 `MessageSvc.PbGetGroupMsg` 与 `MessageSvc.PbGetOneDayRoamMsg`。服务端返回的旧消息体会转换为框架统一消息段，并写入同一套公开 `message_id` 引用，因此可以直接交给 `get_msg`、撤回、转发和已读接口继续使用。本轮没有引入 9.2.75 的 QUA、设备字段或检测位。

`get_group_honor_info` 已使用 Android 9.2.70 的 QQ 登录态与群荣誉服务完成真实验证，可返回龙王、群聊之火、群聊炽焰和快乐源泉榜单。待确认项：机器人加群设置的安卓字段、其余群资料接口的线协议、权限边界，以及设置结果能否被另一客户端稳定读取。`create_group` 已在测试环境完成建群、邀请和成员查询闭环。

## 群相册

- `get_qun_album_list`
- `get_group_album_media_list`
- `upload_image_to_qun_album`
- `del_group_album_media`
- `set_group_album_media_like`
- `cancel_group_album_media_like`
- `do_group_album_comment`

待确认项：能力来自 QQ 安卓协议、QQ 空间网页接口还是客户端内置接口；需要能够稳定获取相册、媒体和评论 ID。

## 在线文件与闪传

- `create_flash_task`
- `get_flash_file_list`
- `get_flash_file_url`
- `send_flash_msg`
- `get_share_link`
- `get_fileset_info`
- `download_fileset`
- `get_fileset_id`
- `get_online_file_msg`
- `send_online_file`
- `send_online_folder`
- `receive_online_file`
- `refuse_online_file`
- `cancel_online_file`

待确认项：安卓 QQ 是否支持创建和接收同类型任务、是否依赖 PC 本地文件会话、任务 ID 与文件集 ID 的来源。

## 客户端状态与设备展示

- `_get_model_show`
- `_set_model_show`
- `set_input_status`
- `nc_get_user_status`

`get_online_clients` 已根据 QQ Android 9.2.70 登录后主动下发的 `RegisterProxy.PushParams` 完成解析：每个客户端包含实例 ID、客户端类型、状态、平台类型和设备名称，框架会在推送到达时更新账号级快照。

`set_online_status` 与 `set_diy_online_status` 已按 QQ Android 9.2.70 的 `OidbSvcTrpcTcp.0x90fb_2` 实现。测试环境已使用 1060221 完成普通在线、自定义状态和恢复普通在线的真实回归，QQ 服务端均返回成功，账号最终保持在线；该命令不在 9.2.70 的 QSign 签名白名单中，因此不额外调用算法服务。其余待确认项仍是安卓协议是否允许修改机型展示、输入状态和查询其他用户状态。

## 自定义表情与收藏

- `fetch_custom_face`
- `fetch_custom_face_detail`
- `add_custom_face`
- `delete_custom_face`
- `set_custom_face_desc`
- `get_collection_list`
- `create_collection`

待确认项：数据是否只存在于 PC 客户端数据库，还是可通过账号侧接口跨设备同步；需要表情/收藏唯一 ID 的真实来源。

## 新消息形态与 AI 能力

- `ArkShareGroup`
- `ArkSharePeer`
- `send_ark_share`
- `send_group_ark_share`
- `click_inline_keyboard_button`
- `get_mini_app_ark`
- `get_ai_characters`
- `get_ai_record`
- `send_group_ai_record`
- `fetch_ptt_text`

待确认项：安卓 QQ 是否提供相同入口、是否按账号或群开放、返回的 Ark/语音地址是否存在时效和权限限制。

## 频道、可疑好友与单向关系

- `get_guild_list`
- `get_guild_service_profile`
- `get_doubt_friends_add_request`
- `set_doubt_friends_add_request`

`get_unidirectional_friend_list` 已按 QQ Android 9.2.70 的 `MQUpdateSvc_com_qq_ti.web.OidbSvc.0xe17_0` 请求结构实现，并在测试环境返回真实单向关系数据。`get_profile_like` 已通过实机入口捕获 `VisitorSvc.ReqGetVoterList`，按 9.2.70 JCE 字段实现，并在测试环境返回真实获赞分页与统计。其余待确认项：当前安卓 QQ 版本是否仍展示对应业务入口，以及请求是否在不同账号权限下可复现。

## 协助验证时需要的信息

任一接口只要能提供以下一种证据，就可以继续进入协议实现：

1. 安卓 QQ 9.2.70 中可复现的操作入口和预期结果；
2. 已脱敏的命令名、请求字段和响应字段；
3. 现有安卓协议实现的文件位置或调用示例；
4. 实机抓包中不含票据、密钥、签名缓冲和聊天隐私的结构摘要。

本清单不包含可由框架本地完成的下载、缓存、流式传输和重启接口，也不包含已经确认存在安卓协议实现的群通知、消息已读、消息历史和群文件基础能力。

消息已读已按安卓 QQ 9.2.70 的 `PbMessageSvc.PbMsgReadedReport` 实现。群聊上报群号与最后消息序号，私聊上报对端 QQ 与最后消息时间；`_mark_all_as_read` 会从内存与 Redis 消息引用中分别选取每个会话的最新游标并发出真实协议请求。该命令不在 QSign 签名白名单中，框架不会为它伪造或请求签名。
