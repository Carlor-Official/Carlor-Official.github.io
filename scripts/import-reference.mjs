// One-time content migration. Normal builds use only checked-in website files.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
const [source, published, tag] = process.argv.slice(2)
if (!source || !published || !tag) throw new Error('Usage: node scripts/import-reference.mjs <existing-docs-src> <public-repository> <release-tag>')
const apiNames = fs.readdirSync(`${source}/api`).filter(n => n.endsWith('.md'))
const git = (...args) => execFileSync('git', ['-C', published, ...args], {encoding:'utf8'})
const currentFiles = git('ls-tree', '-r', '--name-only', tag, 'docs/api').trim().split('\n').filter(Boolean)
const updated = new Map(currentFiles.map(file => [path.basename(file), git('show', `${tag}:${file}`)]))
const suffix = url => url.endsWith('/') || /\.[a-z0-9]+(?:#.*)?$/i.test(url) ? url : url.replace(/(#.*)?$/, '.html$1')
function rewrite(content, origin, current) {
  return content.replace(/\]\(([^\s)]+)\)/g, (all, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all
    let url = href
    if (current && !href.startsWith('/')) {
      const normalized = path.posix.normalize(path.posix.join('docs/api', href))
      if (normalized.startsWith('docs/api/') && apiNames.includes(path.basename(normalized.split('#')[0]))) url = '/api/' + normalized.slice(9).replace(/\.md(?=#|$)/, '.html')
      else return `](https://github.com/Carlor-Official/Mengka-NT/blob/${tag}/${normalized})`
    } else {
      if (!href.startsWith('/')) url = path.posix.normalize(path.posix.join('/' + origin, href))
      if (url === '/guide/' || url === '/guide/index.md') url = '/deploy/'
      else if (url.startsWith('/guide/')) url = url.replace('/guide/', '/reference/')
      url = url.replace(/\.md(?=#|$)/, '.html')
      if (/^\/(api|events|reference)\//.test(url)) url = suffix(url)
    }
    return `](${url})`
  })
}
for (const section of ['api', 'events', 'guide']) {
  const dest = section === 'guide' ? 'reference' : section
  fs.mkdirSync(`docs/${dest}`, { recursive: true })
  for (const name of fs.readdirSync(`${source}/${section}`).filter(n => n.endsWith('.md'))) {
    if (section === 'guide' && name === 'index.md') continue
    if (fs.existsSync(`docs/${dest}/${name}`)) throw new Error(`Refusing to overwrite docs/${dest}/${name}`)
    const current = section === 'api' && updated.has(name)
    const content = current ? updated.get(name) : fs.readFileSync(`${source}/${section}/${name}`, 'utf8')
    fs.writeFileSync(`docs/${dest}/${name}`, rewrite(content, section, current).replace(/\r\n/g, '\n'))
  }
}
console.log(`Imported ${apiNames.length} API pages, events and developer guides; ${updated.size} API pages sourced from ${tag}`)
