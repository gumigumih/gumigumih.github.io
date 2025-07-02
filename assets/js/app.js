const { createApp } = Vue
import WaveAnimation from './components/WaveAnimation.js'
import ArticleList from './components/ArticleList.js'
import Navigation from './components/Navigation.js'
import Header from './components/Header.js'
import Footer from './components/Footer.js'
import ContactForm from './components/ContactForm.js'

// グローバルコンポーネントの登録
const app = createApp({})
app.component('wave-animation', WaveAnimation)
app.component('article-list', ArticleList)
app.component('site-navigation', Navigation)
app.component('site-header', Header)
app.component('site-footer', Footer)
app.component('contact-form', ContactForm)

// アプリケーションのマウント
app.mount('#app') 