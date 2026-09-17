const REPOSITORY = 'Carlor-Official/Mengka-NT'
const LATEST_RELEASE_URL = `https://github.com/${REPOSITORY}/releases/latest`
const MINIMUM_VERSION = '2.3.0'
const VERSION_PATTERN = /^v?(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)$/

const jsonResponse = (body, status = 200, method = 'GET') => new Response(
  method === 'HEAD' ? null : JSON.stringify(body),
  {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200
        ? 'public, max-age=300, stale-while-revalidate=3600'
        : 'no-store',
      'x-content-type-options': 'nosniff'
    }
  }
)

export async function resolveLatestRelease(fetcher = fetch) {
  const response = await fetcher(LATEST_RELEASE_URL, {
    method: 'HEAD',
    redirect: 'manual',
    headers: {
      accept: 'text/html',
      'user-agent': 'Mengka-NT-Version-Policy/2.0'
    },
    cf: { cacheEverything: true, cacheTtl: 300 }
  })
  if (![301, 302, 307, 308].includes(response.status)) {
    throw new Error(`GitHub latest release returned ${response.status}`)
  }
  const location = response.headers.get('location')
  if (!location) throw new Error('GitHub latest release redirect is missing')
  const releaseURL = new URL(location, LATEST_RELEASE_URL)
  if (releaseURL.origin !== 'https://github.com') throw new Error('GitHub latest release redirect is untrusted')
  const prefix = `/Carlor-Official/Mengka-NT/releases/tag/`
  if (!releaseURL.pathname.startsWith(prefix)) throw new Error('GitHub latest release redirect is malformed')
  const tag = decodeURIComponent(releaseURL.pathname.slice(prefix.length))
  const match = tag.match(VERSION_PATTERN)
  if (!match) throw new Error('GitHub latest release tag is not a stable version')
  return { currentVersion: match[1], releaseURL: releaseURL.toString() }
}

async function handle(request) {
  try {
    const latest = await resolveLatestRelease()
    const now = new Date().toISOString()
    return jsonResponse({
      currentVersion: latest.currentVersion,
      minimumVersion: MINIMUM_VERSION,
      releaseUrl: latest.releaseURL,
      repository: REPOSITORY,
      checkedAt: now,
      updatedAt: now,
      githubError: ''
    }, 200, request.method)
  } catch (error) {
    console.error(JSON.stringify({
      event: 'framework_version_policy_failed',
      message: error instanceof Error ? error.message : String(error)
    }))
    return jsonResponse({ error: 'version_policy_unavailable' }, 503, request.method)
  }
}

export const onRequestGet = ({ request }) => handle(request)
export const onRequestHead = ({ request }) => handle(request)
