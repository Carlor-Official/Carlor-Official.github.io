import { defineConfig } from 'vitepress'
import { buildApiSidebar } from './api-sidebar.mjs'

const mainSidebar = [
  { text: '快速开始', collapsed: false, items: [
    { text: '认识萌卡 NT', link: '/guide/' },
    { text: '快速开始', link: '/guide/getting-started.html' },
    { text: '仓库与资源', link: '/guide/resources.html' },
  ] },
  { text: '部署', collapsed: true, items: [
    { text: '部署总览', link: '/deploy/' },
    { text: 'Windows', link: '/deploy/windows.html' },
    { text: 'Linux', link: '/deploy/linux.html' },
  ] },
  { text: '使用', collapsed: true, items: [
    { text: '插件导入', link: '/reference/managed-plugins.html' },
    { text: '正向 WebSocket', link: '/reference/forward-websocket.html' },
    { text: '反向 WebSocket', link: '/reference/reverse-websocket.html' },
    { text: '登录流程', link: '/reference/login-flow.html' },
  ] },
  { text: '开发', collapsed: true, items: [
    { text: '开发总览', link: '/development/' },
    { text: '插件开发入门', link: '/reference/plugin-development.html' },
    { text: 'Node.js SDK', link: '/development/nodejs-sdk.html' },
    { text: 'WebUI SDK', link: '/development/webui-sdk.html' },
  ] },
  { text: 'API 文档', collapsed: true, items: [
    { text: 'API 总览', link: '/api/' },
    { text: '事件参考', link: '/events/' },
    { text: 'Linux QQ API 使用范围', link: '/reference/linuxqq-api-compatibility.html' },
  ] },
  { text: '协议', collapsed: true, items: [
    { text: '通信协议', link: '/reference/protocol.html' },
    { text: '消息段', link: '/reference/message-segments.html' },
  ] },
  { text: '其他', collapsed: true, items: [
    { text: '下载与更新', link: '/releases/' },
    { text: '升级检查单', link: '/releases/upgrade.html' },
  ] },
]

export default defineConfig({
  lang: 'zh-CN',
  title: '萌卡 NT',
  description: '面向 QQ NT 协议的跨平台机器人框架',
  cleanUrls: false,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#fdfdff' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '萌卡 NT',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '部署', link: '/deploy/' },
      { text: '开发', activeMatch: '^/(development|reference|api|events)/', items: [
        { text: '开发指南', link: '/development/' },
        { text: 'API 参考', link: '/api/' },
        { text: '事件参考', link: '/events/' },
      ] },
      {
        text: '版本',
        items: [
          { text: '下载中心', link: '/releases/' },
          { text: '下载最新版', link: 'https://github.com/Carlor-Official/Mengka-NT/releases/latest' },
          { text: '更新记录', link: 'https://github.com/Carlor-Official/Mengka-NT/releases' },
        ],
      },
    ],
    sidebar: {
      '/api/': buildApiSidebar(),
      '/events/': [
        { text: '事件参考', items: [{ text: '事件概述', link: '/events/' }] },
        { text: '事件分类', collapsed: false, items: [
          { text: '消息事件', link: '/events/message.html' },
          { text: '通知事件', link: '/events/notice.html' },
          { text: '请求事件', link: '/events/request.html' },
          { text: '系统事件', link: '/events/system.html' },
        ] },
        { text: '相关文档', collapsed: true, items: [{ text: 'API 参考', link: '/api/' }, { text: '消息段', link: '/reference/message-segments.html' }] },
      ],
      '/reference/': mainSidebar,
      '/guide/': mainSidebar,
      '/deploy/': mainSidebar,
      '/development/': mainSidebar,
      '/releases/': mainSidebar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Carlor-Official/Mengka-NT' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除搜索',
            displayDetails: '显示详细内容',
            footer: { navigateText: '切换', selectText: '打开', closeText: '关闭' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '本页内容' },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    footer: {
      message: '萌卡 NT · 连接想法，也连接你我。',
      copyright: 'Copyright © 2026 Carlor-Official',
    },
  },
})
