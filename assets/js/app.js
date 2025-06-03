const { createApp } = Vue
import WaveAnimation from './components/WaveAnimation.js'
import ArticleList from './components/ArticleList.js'
import Footer from './components/Footer.js'
import Navigation from './components/Navigation.js'

// グローバルコンポーネントの登録
const app = createApp({})
app.component('wave-animation', WaveAnimation)
app.component('article-list', ArticleList)
app.component('site-footer', Footer)
app.component('site-navigation', Navigation)

// アプリケーションのマウント
app.mount('#app') 