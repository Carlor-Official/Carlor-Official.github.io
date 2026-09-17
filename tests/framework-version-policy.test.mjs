import assert from 'node:assert/strict'
import test from 'node:test'
import {
  onRequestGet,
  onRequestHead,
  resolveLatestRelease
} from '../functions/apis/api.mknt.net/v1alpha1/framework-version-policy.js'

const redirect = location => async (_url, init) => {
  assert.equal(init.method, 'HEAD')
  assert.equal(init.redirect, 'manual')
  return new Response(null, { status: 302, headers: { location } })
}

test('latest framework version follows the GitHub release redirect', async () => {
  const result = await resolveLatestRelease(redirect('https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.4.0'))
  assert.deepEqual(result, {
    currentVersion: '2.4.0',
    releaseURL: 'https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.4.0'
  })
})

test('latest framework version rejects untrusted and nonrelease redirects', async () => {
  await assert.rejects(
    resolveLatestRelease(redirect('https://example.invalid/Carlor-Official/Mengka-NT/releases/tag/v9.9.9')),
    /untrusted/
  )
  await assert.rejects(
    resolveLatestRelease(redirect('https://github.com/Carlor-Official/Mengka-NT/releases/tag/latest')),
    /stable version/
  )
})

test('policy endpoint returns a bounded public contract for GET and HEAD', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = redirect('https://github.com/Carlor-Official/Mengka-NT/releases/tag/v2.3.9')
  try {
    const getResponse = await onRequestGet({ request: new Request('https://mknt.net/apis/api.mknt.net/v1alpha1/framework-version-policy') })
    assert.equal(getResponse.status, 200)
    assert.match(getResponse.headers.get('cache-control'), /max-age=300/)
    const body = await getResponse.json()
    assert.equal(body.currentVersion, '2.3.9')
    assert.equal(body.minimumVersion, '2.3.0')
    assert.equal(body.repository, 'Carlor-Official/Mengka-NT')

    const headResponse = await onRequestHead({ request: new Request('https://mknt.net/apis/api.mknt.net/v1alpha1/framework-version-policy', { method: 'HEAD' }) })
    assert.equal(headResponse.status, 200)
    assert.equal(await headResponse.text(), '')
  } finally {
    globalThis.fetch = originalFetch
  }
})
