import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { buildApiSidebar } from '../docs/.vitepress/api-sidebar.mjs'

test('API navigation follows subject and operation categories consistently', () => {
  const sidebar = buildApiSidebar()
  const paths = new Map()
  for (const category of sidebar.slice(1)) for (const group of category.items) for (const item of group.items) paths.set(item.link, [category.text, group.text])
  for (const [action, expected] of [
    ['get_bot_list', ['账号相关', '账号管理']],
    ['get_status', ['账号相关', '账号管理']],
    ['cache_login', ['账号相关', '登录类']],
    ['get_skey', ['账号相关', '凭据类']],
    ['get_level_task_panel', ['账号相关', '任务类']],
    ['send_private_msg', ['好友相关', '消息类']],
    ['upload_friend_image', ['好友相关', '媒体类']],
    ['send_group_msg', ['群聊相关', '消息类']],
    ['get_group_red_packets', ['群聊相关', '红包类']],
    ['send_group_join_request', ['群聊相关', '功能类']],
    ['refresh_account_fingerprint', ['账号相关', '账号管理']],
  ]) assert.deepEqual(paths.get(`/api/${action}.html`), expected, action)
  execFileSync(process.execPath, ['scripts/sync-api-categories.mjs', '--check'])
})

test('retired fingerprint APIs remain readable but are not advertised as callable', () => {
  const active = JSON.parse(fs.readFileSync('shared/api-actions.json', 'utf8')).actions
  assert.equal(active.length, 234)
  for (const action of ['create_device_profile', 'delete_device_profile']) {
    assert.equal(active.includes(action), false)
    const page = fs.readFileSync(`docs/api/${action}.md`, 'utf8')
    assert.match(page, /search: false/)
    assert.match(page, /已移除/)
    assert.match(page, /refresh_account_fingerprint\.html/)
  }
})

test('status timestamps document seconds and distinguish the pending field from released 2.8.0', () => {
  const page = fs.readFileSync('docs/api/get_status.md', 'utf8')
  assert.match(page, /stat\.login_time/)
  assert.match(page, /stat\.online_time/)
  assert.match(page, /秒级 Unix 时间戳/)
  assert.match(page, /2\.8\.0 尚不包含/)
  assert.doesNotMatch(page, /online_time: 3600/)
})
