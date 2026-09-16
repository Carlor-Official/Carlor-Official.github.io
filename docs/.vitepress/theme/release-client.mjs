export const RELEASES_URL = 'https://github.com/Carlor-Official/Mengka-NT/releases'
export const LATEST_URL = `${RELEASES_URL}/latest`
const API_URL = 'https://api.github.com/repos/Carlor-Official/Mengka-NT/releases/latest'
export function parseRelease(data) {
  if (!data || data.draft || data.prerelease || typeof data.tag_name !== 'string' || !data.tag_name.trim()) throw new Error('Invalid release')
  const url = `${RELEASES_URL}/tag/${encodeURIComponent(data.tag_name)}`
  const assets = (Array.isArray(data.assets) ? data.assets : []).filter(asset =>
    typeof asset.name === 'string' && typeof asset.browser_download_url === 'string' &&
    asset.browser_download_url.startsWith(`${RELEASES_URL}/download/`)
  ).map(asset => ({ name: asset.name, url: asset.browser_download_url }))
  const date = new Date(data.published_at)
  return { tag: data.tag_name, url, assets, date: Number.isNaN(date.valueOf()) ? '' : date.toISOString().slice(0, 10) }
}
export async function fetchLatestRelease(fetcher = fetch, timeout = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetcher(API_URL, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' }, cache: 'no-cache' })
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    return parseRelease(await response.json())
  } finally { clearTimeout(timer) }
}
