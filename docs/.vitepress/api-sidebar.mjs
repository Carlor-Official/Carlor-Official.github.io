import fs from 'node:fs'

const readJSON = name => JSON.parse(fs.readFileSync(new URL(`../../shared/${name}`, import.meta.url), 'utf8'))
export const apiCategories = readJSON('api-categories.json')
const catalog = readJSON('api-catalog.json')
const active = new Set(readJSON('api-actions.json').actions)

export function buildApiSidebar() {
  const seen = new Set()
  const categories = apiCategories.map(category => ({
    text: category.text,
    items: category.groups.map(group => ({
      text: group.text,
      collapsed: true,
      items: group.actions.map(action => {
        if (!active.has(action) || seen.has(action) || !catalog[action]) throw new Error(`Invalid or duplicate API category: ${action}`)
        if (!fs.existsSync(new URL(`../api/${action}.md`, import.meta.url))) throw new Error(`Missing API page: ${action}`)
        seen.add(action)
        return { text: catalog[action].title, link: `/api/${action}.html` }
      }),
    })),
  }))
  if (seen.size !== active.size) throw new Error('API categories do not cover all supported actions')
  return [
    { text: 'API 参考', items: [{ text: 'API 总览', link: '/api/' }, { text: '通信协议', link: '/reference/protocol.html' }, { text: '事件参考', link: '/events/' }] },
    ...categories,
  ]
}
