export default {
  name: 'Navigation',
  template: `
    <nav class="page-nav">
      <a v-for="(item, index) in menuItems" 
         :key="index"
         :href="item.href" 
         @click.prevent="scrollToSection(item.href)"
         :class="[
           'page-nav-item',
           currentSection === item.href ? 'active' : ''
         ]">
        <span class="page-nav-label">{{ item.text }}</span>
        <span class="page-nav-dot"></span>
      </a>
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
        document.body.setAttribute('data-section', href.replace('#', ''))
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
    this.currentSection = window.location.hash || '#top'
    document.body.setAttribute('data-section', this.currentSection.replace('#', ''))
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    window.addEventListener('hashchange', () => {
      this.currentSection = window.location.hash || '#top'
      document.body.setAttribute('data-section', this.currentSection.replace('#', ''))
    })
    this.updateCurrentSection()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
} 