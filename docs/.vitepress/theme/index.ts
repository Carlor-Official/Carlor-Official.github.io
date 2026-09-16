import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'
import ReleasePanel from './ReleasePanel.vue'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Regular.css'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Medium.css'
import '../../../node_modules/harmonyos-sans-sc-webfont-splitted/dist/Bold.css'
import './style.css'
import './navigation.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ReleasePanel', ReleasePanel)
  },
}
