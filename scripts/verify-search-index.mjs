import fs from 'node:fs'
import assert from 'node:assert/strict'
import MiniSearch from 'minisearch'
import { buildApiSearchEntries, tokenizeSearch, searchOptions } from '../docs/.vitepress/api-search.mjs'

const chunks = new URL('../docs/.vitepress/dist/assets/chunks/', import.meta.url)
const file = fs.readdirSync(chunks).find(name => name.startsWith('@localSearchIndexroot.'))
assert.ok(file, 'built search index exists')
const { default: json } = await import(new URL(file, chunks))
const index = MiniSearch.loadJSON(json, {
  fields: ['title', 'titles', 'text'], storeFields: ['title', 'titles'], tokenize: tokenizeSearch,
  searchOptions,
})
const entries = buildApiSearchEntries()
for (const [action, { name }] of entries) {
  const expected = `/api/${action}.html#`
  assert.ok(index.search(action)[0]?.id.startsWith(expected), `action ranks first: ${action}`)
  assert.ok(index.search(name).slice(0, 5).some(result => result.id.startsWith(expected)), `Chinese name: ${name}`)
}
for (const [query, action] of [
  ['获取版本信息', 'get_version_info'], ['版本', 'get_version_info'],
  ['上传群聊语音', 'upload_group_voice'], ['upload group voice', 'upload_group_voice'],
]) assert.ok(index.search(query)[0]?.id.startsWith(`/api/${action}.html#`), query)
assert.ok(index.search('快速开始').some(result => result.id.startsWith('/guide/getting-started.html')))
console.log(JSON.stringify({ status: 'ok', apiPages: entries.size, indexedSections: index.documentCount }))
