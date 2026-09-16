import fs from 'node:fs'
import path from 'node:path'
const root=path.resolve('docs/.vitepress/dist')
const missing=new Set(); let pages=0
function walk(dir) { for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  const file=path.join(dir,entry.name)
  if(entry.isDirectory()) walk(file)
  else if(entry.name.endsWith('.html')) {
    pages++
    const content=fs.readFileSync(file,'utf8')
    for(const [,raw] of content.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if(/^(?:[a-z]+:|\/\/)/i.test(raw)) continue
      const url=decodeURIComponent(raw.split(/[?#]/)[0]); if(!url) continue
      let target=url.startsWith('/')?path.join(root,url):path.resolve(path.dirname(file),url)
      if(url.endsWith('/')) target=path.join(target,'index.html')
      if(!fs.existsSync(target) && !fs.existsSync(target+'.html')) missing.add(`${path.relative(root,file)} -> ${url}`)
    }
  }
}}
walk(root)
if(missing.size) {console.error([...missing].join('\n')); process.exit(1)}
console.log(`Validated local href/src targets across ${pages} built pages`)
