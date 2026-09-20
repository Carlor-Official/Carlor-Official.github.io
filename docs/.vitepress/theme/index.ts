import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './HomePage.vue'
import ReleasePanel from './ReleasePanel.vue'
import ApiProtocolSupport from './ApiProtocolSupport.vue'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Regular.css'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Medium.css'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Bold.css'
import './style.css'
import './navigation.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(ApiProtocolSupport),
  }),
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ReleasePanel', ReleasePanel)
  },
}
