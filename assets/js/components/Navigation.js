export default {
  name: 'Navigation',
  template: `
    <nav class="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <ul class="space-y-4">
        <li v-for="(item, index) in menuItems" :key="index">
          <a :href="item.href" 
             @click.prevent="scrollToSection(item.href)"
             :class="[
               'block px-4 py-2 rounded-lg transition-all duration-200 text-right',
               currentSection === item.href 
                 ? 'bg-amber-500 text-white font-medium' 
                 : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
             ]">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </nav>
  `,
  data() {
    return {
      menuItems: [
        { href: '#top', text: 'TOP' },
        { href: '#services', text: 'SERVICES' },
        { href: '#about', text: 'ABOUT' },
        { href: '#works', text: 'WORKS' },
        { href: '#media', text: 'MEDIA' },
        { href: '#contact', text: 'CONTACT' }
      ],
      currentSection: '#top',
      isScrolling: false
    }
  },
  methods: {
    scrollToSection(href) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        this.currentSection = href
        window.history.pushState(null, '', href)
      }
    },
    updateCurrentSection() {
      // 各セクションの位置を確認
      const viewportHeight = window.innerHeight
      const scrollPosition = window.scrollY + (viewportHeight / 3)

      for (const item of this.menuItems) {
        const element = document.querySelector(item.href)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            this.updateSection(item.href)
            break
          }
        }
      }
    },
    updateSection(href) {
      if (this.currentSection !== href) {
        this.currentSection = href
        window.history.replaceState(null, '', href)
      }
    },
    handleScroll() {
      if (!this.isScrolling) {
        requestAnimationFrame(() => {
          this.updateCurrentSection()
          this.isScrolling = false
        })
        this.isScrolling = true
      }
    }
  },
  mounted() {
    // 初期セクションの設定
    this.currentSection = window.location.hash || '#top'
    
    // スクロールイベントの監視
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    
    // ハッシュ変更の監視
    window.addEventListener('hashchange', () => {
      this.currentSection = window.location.hash || '#top'
    })

    // 初期表示時に現在のセクションを更新
    this.updateCurrentSection()
  },
  beforeUnmount() {
    // イベントリスナーの解除
    window.removeEventListener('scroll', this.handleScroll)
  }
} 