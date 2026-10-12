import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createMarkdownRenderer } from 'vitepress'
import MiniSearch from 'minisearch'
import { buildApiSearchEntries, splitApiSearchSections, tokenizeSearch, searchOptions } from '../docs/.vitepress/api-search.mjs'

const md = await createMarkdownRenderer(process.cwd() + '/docs')
const entries = buildApiSearchEntries()
const index = new MiniSearch({
  fields: ['title', 'titles', 'text'], storeFields: ['title', 'titles'],
  tokenize: tokenizeSearch,
  searchOptions,
})
for (const [action] of entries) {
  const file = `docs/api/${action}.md`
  const html = md.render(fs.readFileSync(file, 'utf8'))
  const sections = splitApiSearchSections('/' + file, html)
  assert.equal(sections.length, 1, action)
  const { titles, text, anchor } = sections[0]
  assert.ok(anchor, `API heading anchor: ${action}`)
  index.add({ id: `/api/${action}.html#${anchor}`, title: titles.at(-1), titles: titles.slice(0, -1), text })
}

test('every API is indexed once with its navigation label and action', () => {
  assert.equal(index.documentCount, entries.size)
  for (const [action, { name }] of entries) {
    const results = index.search(action)
    const result = results.find(item => item.id.startsWith(`/api/${action}.html#`))
    assert.ok(result, action)
    assert.equal(result.title, `${name} · ${action}`)
  }
})

test('Chinese names, keywords and action names lead directly to the API', () => {
  for (const query of ['获取版本信息', '版本', 'get_version_info', 'GET_VERSION_INFO', 'version info']) {
    assert.match(index.search(query)[0]?.id ?? '', /^\/api\/get_version_info\.html#/ , query)
  }
  for (const query of ['上传群语音', 'upload_group_voice', 'upload group voice']) {
    assert.match(index.search(query)[0]?.id ?? '', /^\/api\/upload_group_voice\.html#/, query)
  }
  assert.ok(index.search('语音').some(result => result.id.startsWith('/api/upload_group_voice.html#')))
  assert.equal(index.search('不存在的接口xyz987654').length, 0)
})

test('guides retain normal section search and excluded API pages stay excluded', () => {
  assert.equal(splitApiSearchSections('/docs/guide/index.md', '<h1>Guide</h1>'), undefined)
  assert.equal(splitApiSearchSections('/docs/api/index.md', '<h1>API</h1>'), undefined)
  assert.deepEqual(splitApiSearchSections('D:\\docs\\api\\get_version_info.md', ''), [])
})

test('browser-serialized tokenizer matches build-time tokenization', () => {
  const serialized = Function(`return (${tokenizeSearch.toString()})`)()
  for (const text of ['获取版本信息', '上传群语音', 'get_version_info', 'Android 登录', 'skey']) {
    assert.deepEqual(serialized(text), tokenizeSearch(text))
  }
})
