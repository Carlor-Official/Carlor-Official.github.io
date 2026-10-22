import fs from 'node:fs'
import { buildApiSidebar } from '../docs/.vitepress/api-sidebar.mjs'
import { guidanceForAction } from '../shared/api-guidance.mjs'

const catalog = JSON.parse(fs.readFileSync(new URL('../shared/api-catalog.json', import.meta.url), 'utf8'))
const intro = fs.readFileSync(new URL('../shared/api-introduction.md', import.meta.url), 'utf8').replaceAll('\r\n', '\n').trimEnd()
const sections = buildApiSidebar().slice(1).map(category => {
  const groups = category.items.map(group => {
    const rows = group.items.map(item => {
      const action = item.link.match(/\/([^/]+)\.html$/)[1]
      return `| [${item.text}](${item.link}) | ${guidanceForAction(action).scopeLabel} | ${catalog[action].description.replaceAll('|', '\\|')} |`
    })
    return `### ${group.text}\n\n| API | 可用协议 | 说明 |\n| --- | --- | --- |\n${rows.join('\n')}`
  })
  return `## ${category.text}\n\n${groups.join('\n\n')}`
})
const output = `${intro}\n\n${sections.join('\n\n')}\n`
const file = new URL('../docs/api/index.md', import.meta.url)
if (process.argv.includes('--check')) {
  if (fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n') !== output) throw new Error('API category index is out of sync; run npm run sync:api-categories')
} else fs.writeFileSync(file, output)
console.log(JSON.stringify({ categoryGroups: sections.length, status: 'ok' }))
