import fs from 'node:fs/promises'
import path from 'node:path'
import { guidanceForAction, protocolCounts } from '../shared/api-guidance.mjs'

const indexPath = path.resolve(import.meta.dirname, '..', 'docs', 'api', 'index.md')
const source = await fs.readFile(indexPath, 'utf8')
const rows = [...source.matchAll(/^\|\s*\[[^\]]+]\(\/api\/([A-Za-z0-9_]+)(?:\.html)?\)\s*\|\s*([^|]+?)\s*\|/gm)]
const allowed = new Set([
  'Android 协议可用',
  'Linux 协议可用',
  'Android / Linux 双协议可用',
])

if (rows.length !== 234 || new Set(rows.map((row) => row[1])).size !== 234) {
  throw new Error(`API 协议标记必须覆盖 234 个唯一接口，实际 ${rows.length}`)
}

for (const [, action, label] of rows) {
  const normalizedLabel = label.trim()
  if (!allowed.has(normalizedLabel)) throw new Error(`${action} 使用了未允许的协议标记：${normalizedLabel}`)
  const expected = guidanceForAction(action).scopeLabel
  if (normalizedLabel !== expected) throw new Error(`${action} 协议标记未同步：${normalizedLabel} != ${expected}`)
}

const expectations = new Map([
  ['send_group_msg', 'Android / Linux 双协议可用'],
  ['login_account', 'Android / Linux 双协议可用'],
  ['create_login_qr', 'Android / Linux 双协议可用'],
  ['download_file', 'Android / Linux 双协议可用'],
  ['get_pet_profile', 'Android 协议可用'],
  ['get_doubt_friends_add_request', 'Android 协议可用'],
  ['get_level_task_panel', 'Android 协议可用'],
  ['send_group_join_request', 'Android 协议可用'],
])
for (const [action, expected] of expectations) {
  const actual = guidanceForAction(action).scopeLabel
  if (actual !== expected) throw new Error(`${action} 协议分类错误：${actual} != ${expected}`)
}

const counts = protocolCounts(rows.map((row) => row[1]))
if (counts.both + counts.android + counts.linux !== 234) throw new Error('协议分类计数没有覆盖全部 API')
console.log(JSON.stringify({ apiProtocolLabels: rows.length, counts, status: 'ok' }, null, 2))
