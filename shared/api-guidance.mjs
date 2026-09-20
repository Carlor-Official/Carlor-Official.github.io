const linuxNativeActions = new Set([
  'send_friend_request', 'leave_group', 'set_group_name', 'set_group_essence', 'send_poke',
  'set_friend_add_request', 'get_pskey', 'get_essence_msg_list',
  'like_summary_card', 'nc_get_user_status', 'get_group_root_files', 'get_group_files_by_folder',
  'get_login_info', 'get_status', 'get_version_info', 'can_send_image', 'can_send_record', 'get_online_clients',
  'send_msg', 'send_private_msg', 'send_group_msg', 'send_friend_msg', 'send_group_temp_msg', 'delete_msg',
  'recall_group_msg', 'get_msg', 'get_group_msg_history', 'get_friend_msg_history', 'mark_group_msg_as_read',
  'mark_private_msg_as_read', 'mark_msg_as_read', 'mark_all_as_read', 'get_friend_list', 'get_group_list',
  'get_group_member_list', 'set_group_admin', 'set_group_card', 'set_group_special_title', 'set_group_mute',
  'set_group_mute_all', 'kick_group_member', 'set_group_kick_members', 'upload_group_image', 'upload_friend_image',
  'upload_group_voice', 'upload_group_video', 'upload_private_file', 'upload_group_file', 'get_forward_msg',
  'get_group_forward_msg', 'send_forward_msg', 'send_private_forward_msg', 'send_group_forward_msg',
])

const accountIndependentActions = new Set([
  'download_file', 'upload_file_stream', 'clean_stream_temp_file', 'test_download_stream',
  'download_file_stream', 'download_file_image_stream', 'download_file_record_stream', 'set_restart',
  'check_url_safely', 'translate_en2zh', 'get_protocol_list', 'get_device_profile_list',
  'register_captcha_proxy', 'captcha_proxy',
])

const systemManagementActions = new Set([
  'get_plugin_context', 'get_node_list', 'create_node', 'update_node', 'delete_node', 'test_node_latency',
  'create_device_profile', 'delete_device_profile', 'get_account_management_context',
  'create_account_recovery_qr', 'query_account_recovery_qr_status',
  'get_account_settings', 'update_account_settings',
  'get_account_offline_notification', 'update_account_offline_notification',
  'clear_account_cache', 'stop_account_login', 'submit_account_identity_captcha',
  'submit_account_identity_phone', 'confirm_account_identity_sms', 'retry_account_identity_verify',
  'open_account_security_access', 'retry_account_security_verify', 'get_account_access_list',
  'set_account_access', 'clear_account_access', 'get_account_recent_logs',
  'get_bot_list', 'get_bot_info', 'get_protocol_list', 'get_device_profile_list',
  'add_account', 'update_account', 'delete_account',
  'login_account', 'check_cache', 'cache_login', 'submit_slider', 'get_security_verify_methods',
  'get_sms', 'check_sms', 'create_login_qr', 'query_login_qr_status', 'get_level_tasks',
  'execute_level_tasks', 'get_summary_card', 'get_user_agent',
  'get_level_task_accounts', 'get_level_task_account', 'get_level_task_panel',
  'get_level_task_settings', 'update_level_task_settings', 'execute_level_task_selection',
])

const systemManagementIndependentActions = new Set([
  'get_plugin_context', 'get_node_list', 'create_node', 'update_node', 'delete_node', 'test_node_latency',
  'create_device_profile', 'delete_device_profile', 'get_account_management_context',
  'create_account_recovery_qr', 'query_account_recovery_qr_status',
  'get_account_settings', 'update_account_settings', 'get_account_access_list',
  'get_level_task_accounts', 'get_level_task_settings', 'update_level_task_settings',
])

const bothAccountActions = new Set(['get_bot_list', 'get_bot_info'])
const linuxOnlyActions = new Set()
const androidOnlyActions = new Set([
  'scan_qr', 'auth_qr',
  'submit_slider', 'get_security_verify_methods', 'get_sms', 'check_sms',
  'submit_account_identity_captcha', 'submit_account_identity_phone', 'confirm_account_identity_sms',
  'retry_account_identity_verify', 'open_account_security_access', 'retry_account_security_verify',
  'get_level_tasks', 'execute_level_tasks', 'get_level_task_account', 'get_level_task_panel',
  'get_level_task_settings', 'update_level_task_settings', 'execute_level_task_selection',
  'get_doubt_friends_add_request', 'set_doubt_friends_add_request', 'send_group_join_request',
  'fetch_emoji_like', 'get_group_at_all_remain', 'get_group_file_system_info',
  'get_profile_like', 'get_unidirectional_friend_list',
])

function scopeForAction(action) {
  if (linuxOnlyActions.has(action)) return 'linux'
  if (androidOnlyActions.has(action)) return 'android'
  if (systemManagementIndependentActions.has(action)) return 'independent'
  if (systemManagementActions.has(action)) return 'both'
  if (accountIndependentActions.has(action)) return 'independent'
  if (linuxNativeActions.has(action) || bothAccountActions.has(action)) return 'both'
  return 'android'
}

export function guidanceForAction(action) {
  const scope = scopeForAction(action)
  const scopeLabel = {
    independent: 'Android / Linux 双协议可用',
    linux: 'Linux 协议可用',
    android: 'Android 协议可用',
    both: 'Android / Linux 双协议可用',
  }[scope]
  return { action, scope, scopeLabel }
}

export function protocolCounts(actions) {
  const counts = { both: 0, android: 0, linux: 0 }
  for (const action of actions) {
    const scope = scopeForAction(action)
    counts[scope === 'independent' ? 'both' : scope] += 1
  }
  return counts
}
