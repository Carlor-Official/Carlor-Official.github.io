import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { guidanceForAction } from '../shared/api-guidance.mjs'

const indexPath = path.resolve(import.meta.dirname, '..', 'docs', 'api', 'index.md')
const source = await fs.readFile(indexPath, 'utf8')
const newline = source.includes('\r\n') ? '\r\n' : '\n'
const lines = source.split(/\r?\n/)
const apiRow = /^(\|\s*\[[^\]]+]\(\/api\/([A-Za-z0-9_]+)(?:\.html)?\)\s*\|)\s*(.*)\|\s*$/
const protocolLabels = [
  'Android 协议可用',
  'Linux 协议可用',
  'Android / Linux 双协议可用',
]

let count = 0
for (let index = 0; index < lines.length; index += 1) {
  const match = lines[index].match(apiRow)
  if (!match) continue

  const action = match[2]
  let description = match[3].trim()
  for (const label of protocolLabels) {
    if (description.startsWith(label)) {
      description = description.slice(label.length).trim()
      break
    }
  }
  description = description.replace(/^(?:\|\s*)+/, '')
  lines[index] = `${match[1]} ${guidanceForAction(action).scopeLabel} | ${description} |`
  count += 1

  if (index >= 2 && /^\|\s*API\s*\|/.test(lines[index - 2])) {
    lines[index - 2] = '| API | 可用协议 | 说明 |'
    lines[index - 1] = '| --- | --- | --- |'
  }
}

if (count !== 234) throw new Error(`API 总览应包含 234 个接口，实际处理 ${count} 个`)

const output = lines.join(newline)
if (process.argv.includes('--check')) {
  if (output !== source) {
    console.error('API 协议标记未同步，请运行 npm run sync:api-protocols')
    process.exitCode = 1
  } else {
    console.log(JSON.stringify({ apiProtocolLabels: count, status: 'ok' }))
  }
} else {
  await fs.writeFile(indexPath, output, 'utf8')
  console.log(JSON.stringify({ apiProtocolLabels: count, indexPath }))
}
