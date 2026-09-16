import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { parseRelease, fetchLatestRelease, RELEASES_URL } from '../docs/.vitepress/theme/release-client.mjs'
import { buildApiSidebar } from '../docs/.vitepress/api-sidebar.mjs'
test('latest release is read from response, not a fixed version', () => {
  const result = parseRelease({ tag_name: 'v99.7.1', published_at: '2030-01-03T02:00:00Z', assets: [{name:'package.zip', browser_download_url:`${RELEASES_URL}/download/v99.7.1/package.zip`}] })
  assert.equal(result.tag, 'v99.7.1'); assert.equal(result.date, '2030-01-03'); assert.equal(result.assets.length, 1)
})
test('reject nonformal, malformed and unsafe release data', () => {
  for (const data of [null, {}, {tag_name:'v1',draft:true}, {tag_name:'v1',prerelease:true}]) assert.throws(() => parseRelease(data))
  assert.equal(parseRelease({tag_name:'v1', assets:[{name:'bad',browser_download_url:'javascript:alert(1)'},{name:'bad',browser_download_url:'https://evil.example/download'}]}).assets.length,0)
})
test('GitHub limits and network errors remain errors (no stale version)', async () => {
  await assert.rejects(fetchLatestRelease(async () => ({ok:false,status:403})), /403/)
  await assert.rejects(fetchLatestRelease(async () => {throw new Error('offline')}), /offline/)
})
test('requests time out', async () => {
  await assert.rejects(fetchLatestRelease((url,{signal}) => new Promise((resolve,reject) => signal.addEventListener('abort',()=>reject(new Error('timeout')))),5),/timeout/)
})
test('every API page is present exactly once in the layered menu', () => {
  const sidebar = buildApiSidebar(); const found=[]
  function walk(items) { for(const item of items) {if(item.link?.startsWith('/api/') && item.link !== '/api/') found.push(item.link); if(item.items) walk(item.items)} }
  walk(sidebar)
  const expected=fs.readdirSync('docs/api').filter(n=>n.endsWith('.md')&&n!=='index.md').map(n=>'/api/'+n.replace('.md','.html'))
  assert.deepEqual([...found].sort(),expected.sort()); assert.equal(found.length,new Set(found).size)
  for(const group of sidebar.slice(1)) {assert.equal(group.collapsed,true); for(const subgroup of group.items) {assert.equal(subgroup.collapsed,true); assert.ok(subgroup.items.length)}}
})
test('all internal sidebar links resolve to real pages', () => {
  function walk(items) {for(const item of items) {if(item.link?.startsWith('/')) assert.ok(fs.existsSync('docs'+item.link.replace(/\/$/,'/index.md').replace(/\.html$/,'.md')),item.link); if(item.items) walk(item.items)}}
  walk(buildApiSidebar())
})
test('temporary homepage labels and fixed latest-version labels are absent', () => {
  const files=['docs/.vitepress/theme/HomePage.vue','docs/.vitepress/config.mts','docs/releases/index.md','docs/guide/index.md','docs/guide/getting-started.md']
  for(const file of files) assert.doesNotMatch(fs.readFileSync(file,'utf8'), /官网预览|预发布版本|网站源码|官网源码|v2\.3\.9/)
})
