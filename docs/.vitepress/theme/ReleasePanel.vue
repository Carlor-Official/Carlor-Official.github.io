<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PhArrowUpRight, PhDownloadSimple } from '@phosphor-icons/vue'
import { fetchLatestRelease, LATEST_URL } from './release-client.mjs'
defineProps<{ detailed?: boolean }>()
const release = ref<Awaited<ReturnType<typeof fetchLatestRelease>> | null>(null)
const status = ref('loading')
onMounted(async () => {
  try { release.value = await fetchLatestRelease(); status.value = 'ready' }
  catch { status.value = 'error' }
})
</script>
<template>
  <section class="mk-release-panel" aria-label="最新正式版">
    <div class="mk-release">
      <div aria-live="polite">
        <span class="mk-release-label">正式发布</span>
        <h2>{{ release ? `萌卡 NT ${release.tag}` : '下载萌卡 NT' }}</h2>
        <p v-if="release">发布于 {{ release.date || 'GitHub Releases' }} · 版本信息来自官方 GitHub</p>
        <p v-else-if="status === 'error'">暂时无法读取版本信息，请前往官方发布页查看。</p>
        <p v-else>正在读取最新正式版…</p>
      </div>
      <div class="mk-release-actions"><a class="mk-button mk-primary" :href="release?.url || LATEST_URL"><PhDownloadSimple :size="19" aria-hidden="true" />下载最新版</a><a class="mk-text-link" href="/releases/upgrade.html">升级说明 <PhArrowUpRight :size="16" aria-hidden="true" /></a></div>
    </div>
    <div v-if="detailed && release?.assets.length" class="mk-downloads">
      <h2>版本文件</h2><p>选择与你的操作系统、CPU 架构相符的文件，并使用校验文件核对完整性。</p>
      <a v-for="asset in release.assets" :key="asset.url" :href="asset.url"><PhDownloadSimple :size="20" aria-hidden="true" /><span>{{ asset.name }}</span><PhArrowUpRight :size="16" aria-hidden="true" /></a>
    </div>
  </section>
</template>
