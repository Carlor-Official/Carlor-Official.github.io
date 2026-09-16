<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhBookOpen, PhCode, PhDownloadSimple, PhGithubLogo, PhPlugsConnected, PhSquaresFour, PhTerminalWindow } from '@phosphor-icons/vue'

const features = [
  { icon: PhSquaresFour, title: '多账号，一个控制台', text: '账号、设备指纹与连接节点集中管理。通过 WebUI 查看状态，让日常操作清晰有序。', href: '/guide/', link: '认识萌卡 NT' },
  { icon: PhTerminalWindow, title: '部署简单，运行自在', text: '支持 Windows 与 Linux，使用本地 SQLite 存储。从个人电脑到服务器，都有对应的部署指南。', href: '/deploy/', link: '查看部署指南' },
  { icon: PhPlugsConnected, title: '用插件，拓展更多可能', text: '通过 WebSocket 接入插件，使用 Node.js SDK 调用接口、订阅事件，连接你的机器人应用。', href: '/development/', link: '了解插件开发' },
]
const resources = [
  { icon: PhBookOpen, title: '安装与配置', description: '从下载框架到登录第一个 QQ 账号', href: '/guide/getting-started.html' },
  { icon: PhCode, title: 'API 与事件', description: '查阅接口、消息事件与调用约定', href: '/development/api.html' },
  { icon: PhPlugsConnected, title: 'Node.js SDK', description: '连接框架，开始编写你的插件', href: '/development/nodejs-sdk.html' },
  { icon: PhSquaresFour, title: 'WebUI SDK', description: '为插件接入可视化管理页面', href: '/development/webui-sdk.html' },
]
</script>

<template>
  <main class="mk-home">
    <section class="mk-hero" aria-labelledby="mk-title">
      <div class="mk-hero-copy">
        <a class="mk-announcement" href="/releases/">萌卡 NT 2.0 官网预览 <PhArrowUpRight :size="14" aria-hidden="true" /></a>
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
        <img src="/logo.png" width="486" height="512" alt="萌卡 NT 品牌形象" fetchpriority="high" />
      </div>
    </section>

    <section class="mk-feature-grid" aria-label="框架特性">
      <a v-for="feature in features" :key="feature.title" :href="feature.href" class="mk-feature-card">
        <span class="mk-icon"><component :is="feature.icon" :size="27" weight="duotone" aria-hidden="true" /></span>
        <h2>{{ feature.title }}</h2><p>{{ feature.text }}</p>
        <span class="mk-card-link">{{ feature.link }} <PhArrowRight :size="16" aria-hidden="true" /></span>
      </a>
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

    <section class="mk-release" aria-labelledby="mk-release-title">
      <div><span class="mk-release-label">正式版本</span><h2 id="mk-release-title">萌卡 NT v2.3.9</h2><p>Windows AMD64 / Linux AMD64 / Linux ARM64</p></div>
      <div class="mk-release-actions"><a class="mk-button mk-primary" href="https://github.com/Carlor-Official/Mengka-NT/releases/latest"><PhDownloadSimple :size="19" aria-hidden="true" />下载最新版</a><a class="mk-text-link" href="/releases/upgrade.html">升级说明 <PhArrowUpRight :size="16" aria-hidden="true" /></a></div>
    </section>

    <div class="mk-footer-links" aria-label="更多资源">
      <div class="mk-footer-brand"><img src="/logo.png" width="36" height="38" alt="" /><span>萌卡 NT<small>连接想法，也连接你我。</small></span></div>
      <div><h2>使用指南</h2><a href="/deploy/windows.html">Windows 部署</a><a href="/deploy/linux.html">Linux 部署</a></div>
      <div><h2>开发资源</h2><a href="/development/api.html">API 文档</a><a href="/development/nodejs-sdk.html">Node.js SDK</a></div>
      <div><h2>项目</h2><a href="https://github.com/Carlor-Official/Mengka-NT/releases">发布记录</a><a href="https://github.com/Carlor-Official/Carlor-Official.github.io">网站源码</a></div>
    </div>
  </main>
</template>
