<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhBookOpen, PhCode, PhGithubLogo, PhPlugsConnected, PhSquaresFour, PhDesktopTower, PhPackage, PhCheckCircle, PhBrowsers } from '@phosphor-icons/vue'
import ReleasePanel from './ReleasePanel.vue'

const features = [
  { icon: PhSquaresFour, title: '多账号可视化管理', text: '在统一后台查看账号状态、消息统计、节点连接与运行情况，日常维护更加直观。', href: '/guide/', link: '了解框架' },
  { icon: PhPackage, title: '内置插件市场', text: '框架自动同步云端插件列表，支持详情查看、快捷安装、检查更新和卸载。', href: '/development/', link: '了解插件生态' },
  { icon: PhDesktopTower, title: '智能跨平台安装', text: '根据当前框架运行环境自动选择 Windows 或 Linux 插件版本，减少手动判断。', href: '/deploy/', link: '选择部署方式' },
  { icon: PhPlugsConnected, title: '双向 WebSocket', text: '插件可选择正向 WebSocket、反向 WebSocket，或同时支持两种接入模式。', href: '/development/nodejs-sdk.html', link: '接入 SDK' },
  { icon: PhCode, title: '标准 SDK 与 API', text: '统一的事件与 API 规范让插件开发者可以复用相同链路，快速接入框架能力。', href: '/api/', link: '查阅接口文档' },
  { icon: PhBrowsers, title: '插件 Web 后台联动', text: '支持有管理页面的插件在框架内打开后台，同时兼容没有 Web 页面的轻量插件。', href: '/development/webui-sdk.html', link: '了解 WebUI SDK' },
]
const showcases = [
  { title: '萌卡 NT 框架', image: '/framework-overview.png', href: '/guide/getting-started.html', link: '开始部署框架', points: ['可视化管理 QQ 账号、节点与运行状态', 'Windows 与 Linux 双平台部署', '正向、反向 WebSocket 两种接入方式', '内置插件市场，无需用户手动对接', '服务列表支持快捷创建和统一管理', '更新、运行状态与操作日志集中查看'] },
  { title: '开发者平台与插件生态', image: '/developer-ecosystem.png', href: 'https://mknt.rezcwl.com/developers/', link: '进入开发者平台', points: ['开发者账号由管理员统一创建和管理', '支持草稿、审核、上架、下架和版本更新', 'Windows、Linux 下载地址分别维护', '标准 SDK 与完整 API、事件文档', '插件 Web 后台可与框架界面联动', '云端市场与框架自动同步插件状态'] },
]
const resources = [
  { icon: PhBookOpen, title: '安装与配置', description: '从下载框架到登录第一个 QQ 账号', href: '/guide/getting-started.html' },
  { icon: PhCode, title: 'API 与事件', description: '查阅接口、消息事件与调用约定', href: '/api/' },
  { icon: PhPlugsConnected, title: 'Node.js SDK', description: '连接框架，开始编写你的插件', href: '/development/nodejs-sdk.html' },
  { icon: PhSquaresFour, title: 'WebUI SDK', description: '为插件接入可视化管理页面', href: '/development/webui-sdk.html' },
]
</script>

<template>
  <main class="mk-home">
    <section class="mk-hero" aria-labelledby="mk-title">
      <div class="mk-hero-copy">
        <span class="mk-announcement">跨平台 QQ 机器人框架</span>
        <h1 id="mk-title">萌卡 <span>NT</span></h1>
        <h2>让机器人连接<br />你的每一个想法。</h2>
        <p>面向 QQ NT 协议的跨平台机器人框架。<br class="mk-desktop-break" />多账号管理、可视化配置，从部署到插件开发。</p>
        <div class="mk-actions">
          <a class="mk-button mk-primary" href="/guide/getting-started.html">开始使用 <PhArrowRight :size="18" aria-hidden="true" /></a>
          <a class="mk-button mk-secondary" href="https://github.com/Carlor-Official/Mengka-NT"><PhGithubLogo :size="20" aria-hidden="true" /> GitHub</a>
        </div>
      </div>
      <div class="mk-hero-art">
        <div class="mk-art-halo" aria-hidden="true"></div>
        <img src="/mascot-clean.png" width="512" height="512" alt="萌卡 NT 品牌形象" fetchpriority="high" />
      </div>
    </section>

    <section v-for="(showcase, index) in showcases" :key="showcase.title" class="mk-showcase" :aria-labelledby="`showcase-${index}`">
      <div class="mk-showcase-image"><img :src="showcase.image" width="1536" height="1024" :alt="`${showcase.title}实际界面`" loading="lazy" /></div>
      <div class="mk-showcase-copy">
        <h2 :id="`showcase-${index}`">{{ showcase.title }}</h2>
        <ul><li v-for="point in showcase.points" :key="point"><PhCheckCircle :size="23" weight="fill" aria-hidden="true" /><span>{{ point }}</span></li></ul>
        <a class="mk-text-link" :href="showcase.href">{{ showcase.link }} <PhArrowUpRight :size="16" aria-hidden="true" /></a>
      </div>
    </section>

    <section class="mk-features" aria-labelledby="mk-features-title">
      <div class="mk-section-heading"><h2 id="mk-features-title">核心特色</h2><p>从账号运行、插件安装到开发发布，所有关键能力围绕同一套框架协同工作。</p></div>
      <div class="mk-feature-grid">
      <a v-for="feature in features" :key="feature.title" :href="feature.href" class="mk-feature-card">
        <span class="mk-icon"><component :is="feature.icon" :size="27" weight="duotone" aria-hidden="true" /></span>
        <h3>{{ feature.title }}</h3><p>{{ feature.text }}</p>
        <span class="mk-card-link">{{ feature.link }} <PhArrowRight :size="16" aria-hidden="true" /></span>
      </a>
      </div>
    </section>

    <section class="mk-resources" aria-labelledby="mk-resources-title">
      <div class="mk-section-heading"><h2 id="mk-resources-title">从这里开始探索</h2><p>第一次使用，或准备开发新插件，都能找到下一步。</p></div>
      <div class="mk-resource-grid">
        <a v-for="resource in resources" :key="resource.title" :href="resource.href" class="mk-resource-card">
          <span class="mk-resource-icon"><component :is="resource.icon" :size="24" weight="duotone" aria-hidden="true" /></span>
          <span class="mk-resource-copy"><h3>{{ resource.title }}</h3><p>{{ resource.description }}</p></span>
          <PhArrowUpRight :size="20" class="mk-resource-arrow" aria-hidden="true" />
        </a>
      </div>
    </section>

    <ReleasePanel />

    <div class="mk-footer-links" aria-label="更多资源">
      <div class="mk-footer-brand"><img src="/logo.png" width="36" height="38" alt="" /><span>萌卡 NT<small>连接想法，也连接你我。</small></span></div>
      <div><h2>使用指南</h2><a href="/deploy/windows.html">Windows 部署</a><a href="/deploy/linux.html">Linux 部署</a></div>
      <div><h2>开发资源</h2><a href="/api/">API 文档</a><a href="/events/">事件参考</a><a href="/development/nodejs-sdk.html">Node.js SDK</a></div>
      <div><h2>项目</h2><a href="https://github.com/Carlor-Official/Mengka-NT/releases">发布记录</a><a href="https://github.com/Carlor-Official/Mengka-NT/issues">问题反馈</a></div>
    </div>
  </main>
</template>
