import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

// Pass a single pathspec to Git: expanding every asset exceeds Windows's
// command-line limit once the documentation and font subsets are included.
const root = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(root, 'docs/.vitepress/dist')
const repo = 'https://github.com/Carlor-Official/Carlor-Official.github.io.git'
if (!fs.existsSync(path.join(dist, 'index.html')) ||
    fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim() !== 'mknt.net') {
  throw new Error('Build the complete mknt.net site before publishing.')
}
const tempRoot = fs.realpathSync(os.tmpdir())
const publishDir = fs.mkdtempSync(path.join(tempRoot, 'mknt-pages-'))
function git(args, cwd = publishDir) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}
try {
  git(['clone', '--depth', '1', '--single-branch', '--branch', 'gh-pages', repo, publishDir], root)
  // Validate the exact temporary checkout before removing its old build assets.
  if (fs.realpathSync(publishDir) !== publishDir ||
      path.dirname(publishDir) !== tempRoot ||
      !path.basename(publishDir).startsWith('mknt-pages-') ||
      git(['remote', 'get-url', 'origin']) !== repo ||
      git(['branch', '--show-current']) !== 'gh-pages' ||
      git(['status', '--porcelain'])) throw new Error('Unexpected publication checkout.')
  git(['rm', '-r', '--ignore-unmatch', '--', '.'])
  fs.cpSync(dist, publishDir, { recursive: true })
  git(['add', '--all', '--', '.'])
  if (git(['diff', '--cached', '--name-only'])) {
    const source = git(['rev-parse', 'HEAD'], root)
    git(['commit', '-m', `Publish website from ${source}`])
    git(['push', 'origin', 'HEAD:gh-pages'])
  }
  console.log(`Published ${git(['rev-parse', 'HEAD'])} to mknt.net (Pages build pending).`)
  // Only the validated, newly created publication clone is removed.
  fs.rmSync(publishDir, { recursive: true, force: true })
} catch (error) {
  console.error(`Publication failed; temporary checkout retained at ${publishDir}`)
  throw error
}
