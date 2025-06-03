const { createApp } = Vue
import WaveAnimation from './components/WaveAnimation.js'
import ArticleList from './components/ArticleList.js'

// グローバルコンポーネントの登録
const app = createApp({})
app.component('wave-animation', WaveAnimation)
app.component('article-list', ArticleList)

// アプリケーションのマウント
app.mount('#app') 