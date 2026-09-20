<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { guidanceForAction } from '../../../shared/api-guidance.mjs'

const route = useRoute()

const guidance = computed(() => {
  const match = route.path.match(/^\/api\/([^/]+?)(?:\.html)?$/)
  return match?.[1] ? guidanceForAction(match[1]) : null
})

const availability = computed(() => guidance.value?.scope === 'independent' ? 'both' : guidance.value?.scope)
</script>

<template>
  <aside
    v-if="guidance"
    class="api-protocol-support"
    :data-availability="availability"
    aria-label="API 协议可用范围"
  >
    <span class="api-protocol-support__label">协议支持</span>
    <strong>{{ guidance.scopeLabel }}</strong>
    <small v-if="guidance.scope === 'independent'">此接口不依赖具体账号协议</small>
  </aside>
</template>
