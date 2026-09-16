import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'
import ReleasePanel from './ReleasePanel.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ReleasePanel', ReleasePanel)
  },
}
