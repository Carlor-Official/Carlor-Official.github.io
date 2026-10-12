import { buildApiSidebar } from './api-sidebar.mjs'

// Use the navigation labels as the single source of API names.
export function buildApiSearchEntries() {
  const entries = new Map()
  function visit(items, category = '') {
    for (const item of items) {
      const match = item.link?.match(/^\/api\/([^/]+)\.html$/)
      if (match) entries.set(match[1], { name: item.text, category })
      if (item.items) visit(item.items, category || item.text)
    }
  }
  visit(buildApiSidebar())
  return entries
}

const entries = buildApiSearchEntries()

export function splitApiSearchSections(file, html) {
  const action = file.replaceAll('\\', '/').match(/\/api\/([^/]+)\.md$/)?.[1]
  const entry = entries.get(action)
  // Keep the standard heading-based index for guides and reference pages.
  if (!entry) return undefined
  if (!html) return []
  const escape = value => value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char])
  return [{
    anchor: html.match(/<h1\b[^>]*>[\s\S]*?href="#([^"]+)"/)?.[1],
    titles: [escape(entry.category), escape(`${entry.name} · ${action}`)],
    text: html.replace(/<[^>]*>/g, ' '),
  }]
}

// VitePress serializes this function for the browser: keep it self-contained.
export function tokenizeSearch(text) {
  const tokens = []
  const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (!isWordLike) continue
    tokens.push(segment)
    if (segment.includes('_')) tokens.push(...segment.split('_').filter(Boolean))
  }
  return tokens
}

export const searchOptions = {
  combineWith: 'AND', fuzzy: false, prefix: true,
  boost: { title: 8, titles: 1, text: 1 },
  // Prefer the callable API over mentions in tutorials or catalog tables.
  boostDocument: function (id) {
    return /^\/api\/[^/]+\.html#/.test(id) ? 1.5 : /^\/api\/#/.test(id) ? 0.4 : 1
  },
}
