import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '萌卡 NT',
  description: '面向 QQ NT 协议的跨平台机器人框架',
  cleanUrls: false,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#080b14' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '萌卡 NT',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '部署', link: '/deploy/' },
      { text: '开发', link: '/development/' },
      { text: '版本', link: '/releases/' },
      {
        text: 'v2.3.8',
        items: [
          { text: '下载最新版', link: 'https://github.com/Carlor-Official/Mengka-NT/releases/latest' },
          { text: '更新记录', link: 'https://github.com/Carlor-Official/Mengka-NT/releases' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '认识萌卡 NT', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '仓库与资源', link: '/guide/resources' },
          ],
        },
      ],
      '/deploy/': [
        {
          text: '部署与运维',
          items: [
            { text: '部署总览', link: '/deploy/' },
            { text: 'Windows', link: '/deploy/windows' },
            { text: 'Linux', link: '/deploy/linux' },
          ],
        },
      ],
      '/development/': [
        {
          text: '插件开发',
          items: [
            { text: '开发总览', link: '/development/' },
            { text: 'API 与事件', link: '/development/api' },
            { text: 'Node.js SDK', link: '/development/nodejs-sdk' },
            { text: 'WebUI SDK', link: '/development/webui-sdk' },
          ],
        },
      ],
      '/releases/': [
        {
          text: '版本与升级',
          items: [
            { text: '发布中心', link: '/releases/' },
            { text: '升级检查单', link: '/releases/upgrade' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Carlor-Official/Mengka-NT' },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本页内容' },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    editLink: {
      pattern: 'https://github.com/Carlor-Official/Carlor-Official.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '萌卡 NT 2.0 官网 · 当前为预发布版本',
      copyright: 'Copyright © 2026 Carlor-Official',
    },
  },
})
