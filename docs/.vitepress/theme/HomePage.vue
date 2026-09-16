<script setup lang="ts">
const features = [
  {
    index: '01',
    title: '多账号，多节点',
    text: '集中管理 QQ 账号、协议、设备指纹与连接节点，让不同环境各自独立、状态清晰。',
  },
  {
    index: '02',
    title: '插件即服务',
    text: '正向与反向 WebSocket、Node.js SDK、WebUI SDK，以及统一的 action 结果与事件模型。',
  },
  {
    index: '03',
    title: 'Windows + Linux',
    text: '提供 Windows AMD64、Linux AMD64 与 Linux ARM64 正式包，使用同一套 WebUI 管理。',
  },
]

const paths = [
  { eyebrow: '第一次使用', title: '10 分钟启动框架', text: '下载、初始化、添加节点与账号。', href: '/guide/getting-started', action: '开始安装' },
  { eyebrow: '部署到服务器', title: '稳定运行在 Linux', text: 'systemd 守护、Nginx 与 WebSocket 反代。', href: '/deploy/linux', action: '查看部署' },
  { eyebrow: '构建插件', title: '连接 234 个 action', text: '从认证、调用到事件订阅，快速接入 SDK。', href: '/development/', action: '进入开发' },
]
</script>

<template>
  <main class="mk-home">
    <section class="mk-hero">
      <div class="mk-grid" aria-hidden="true"></div>
      <div class="mk-orb mk-orb-a" aria-hidden="true"></div>
      <div class="mk-orb mk-orb-b" aria-hidden="true"></div>
      <div class="mk-hero-inner">
        <div class="mk-hero-copy">
          <div class="mk-kicker"><span></span> MENGKA NT / NEXT</div>
          <h1>把复杂的 QQ 机器人运行环境，<em>收进一套清晰的系统。</em></h1>
          <p>面向 QQ NT 协议的跨平台机器人框架。多账号、多节点、可视化 WebUI 与完整插件能力，从安装到扩展都在这里。</p>
          <div class="mk-actions">
            <a class="mk-button mk-button-primary" href="/guide/getting-started">立即开始 <span aria-hidden="true">→</span></a>
            <a class="mk-button mk-button-secondary" href="https://github.com/Carlor-Official/Mengka-NT/releases/latest">下载 v2.3.8</a>
          </div>
          <div class="mk-meta" aria-label="平台与版本信息">
            <span><i class="mk-status"></i> 当前正式版 v2.3.8</span>
            <span>Windows</span><span>Linux</span><span>AMD64 / ARM64</span>
          </div>
        </div>

        <div class="mk-console" aria-label="萌卡 NT 启动示例">
          <div class="mk-console-head"><span></span><span></span><span></span><b>mengka-nt / overview</b></div>
          <div class="mk-console-body">
            <div class="mk-console-brand"><img src="/logo.png" alt="" /><div><strong>萌卡 NT</strong><small>Framework online</small></div></div>
            <div class="mk-stat-row"><div><small>ACCOUNTS</small><strong>08</strong><em>7 online</em></div><div><small>NODES</small><strong>03</strong><em>all healthy</em></div></div>
            <div class="mk-terminal"><span class="mk-prompt">$</span> ./mengka-nt<br/><span class="mk-muted">[ready]</span> WebUI listening on :6099<br/><span class="mk-muted">[ready]</span> plugin gateway connected<span class="mk-cursor"></span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="mk-section mk-intro">
      <div class="mk-section-label">SYSTEM / 01</div>
      <div class="mk-intro-copy"><h2>不是一堆零散工具。<br/>是一条完整的运行链路。</h2><p>账号从登录、路由到事件投递，插件从认证、调用到网页管理，都由同一个框架衔接。</p></div>
      <div class="mk-features">
        <article v-for="feature in features" :key="feature.index"><span>{{ feature.index }}</span><h3>{{ feature.title }}</h3><p>{{ feature.text }}</p></article>
      </div>
    </section>

    <section class="mk-section mk-paths">
      <div class="mk-section-label">START / 02</div>
      <div class="mk-paths-head"><h2>从你现在的位置出发</h2><p>安装、部署与开发，选择一条最短路径。</p></div>
      <div class="mk-path-grid">
        <a v-for="path in paths" :key="path.href" :href="path.href">
          <small>{{ path.eyebrow }}</small><h3>{{ path.title }}</h3><p>{{ path.text }}</p><span>{{ path.action }} →</span>
        </a>
      </div>
    </section>

    <section class="mk-cta">
      <div><small>READY TO RUN</small><h2>从最新版开始。</h2><p>只从官方 GitHub Release 下载正式外发包。</p></div>
      <div class="mk-actions"><a class="mk-button mk-button-primary" href="https://github.com/Carlor-Official/Mengka-NT/releases/latest">前往发布库</a><a class="mk-button mk-button-secondary" href="/releases/upgrade">阅读升级说明</a></div>
    </section>
  </main>
</template>
