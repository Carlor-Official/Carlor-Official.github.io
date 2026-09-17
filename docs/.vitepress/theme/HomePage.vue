<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhBookOpen, PhCode, PhGithubLogo, PhPlugsConnected, PhSquaresFour, PhPackage, PhCheckCircle, PhBrowsers, PhShieldCheck } from '@phosphor-icons/vue'
import ReleasePanel from './ReleasePanel.vue'

const features = [
  { icon: PhSquaresFour, title: '多账号可视化管理', text: '在统一后台查看账号状态、消息统计、节点连接与运行情况，日常维护更加直观。', href: '/guide/', link: '了解框架' },
  { icon: PhShieldCheck, title: '本地管理员初始化', text: '首次访问直接创建本地管理员账号和密码，不依赖官网令牌或远程用户系统。', href: '/guide/getting-started.html', link: '查看初始化流程' },
  { icon: PhPackage, title: '本地插件导入', text: '上传 ZIP 或 TAR.GZ 成品包，框架在本地完成校验、安装、运行和版本替换。', href: '/reference/managed-plugins.html', link: '查看导入方式' },
  { icon: PhPlugsConnected, title: '双向 WebSocket', text: '插件可选择正向 WebSocket、反向 WebSocket，或同时支持两种接入模式。', href: '/development/nodejs-sdk.html', link: '接入 SDK' },
  { icon: PhCode, title: '标准 SDK 与 API', text: '统一的事件与 API 规范让插件开发者可以复用相同链路，快速接入框架能力。', href: '/api/', link: '查阅接口文档' },
  { icon: PhBrowsers, title: '插件 Web 后台联动', text: '支持有管理页面的插件在框架内打开后台，同时兼容没有 Web 页面的轻量插件。', href: '/development/webui-sdk.html', link: '了解 WebUI SDK' },
]
const showcases = [
  { title: '萌卡 NT 框架', image: '/framework-overview.png', href: '/guide/getting-started.html', link: '开始部署框架', points: ['可视化管理 QQ 账号、节点与运行状态', 'Windows 与 Linux 双平台部署', '插件包从本地上传并生成管理卡片', '正向、反向 WebSocket 两种接入方式', '本地管理员独立完成初始化和登录', '更新、运行状态与操作日志集中查看'] },
  { title: '开发文档与扩展接入', image: '/api-reference.png', href: '/development/', link: '进入开发文档', points: ['API 按功能与子类分层展示', '正向、反向 WebSocket 接入文档', '标准 Node.js SDK 与完整事件参考', 'Windows、Linux 部署教程分别维护', '插件 Web 管理端可与框架界面联动', '正式版本和下载文件从 GitHub Releases 读取'] },
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
      <div class="mk-section-heading"><h2 id="mk-features-title">核心特色</h2><p>从账号运行、本地插件导入到外部服务对接，所有关键能力围绕同一套框架协同工作。</p></div>
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
