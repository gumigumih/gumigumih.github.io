export default {
  name: 'SiteHeader',
  props: {
    baseUrl: {
      type: String,
      default: ''
    }
  },
  template: `
    <header class="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <a :href="baseUrl + '/'" class="text-xl font-bold text-slate-800 font-raleway">meg+gumi</a>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a :href="baseUrl + '/#top'" class="text-slate-600 hover:text-amber-500 transition-colors">HOME</a>
            <a :href="baseUrl + '/#services'" class="text-slate-600 hover:text-amber-500 transition-colors">SERVICES</a>
            <a :href="baseUrl + '/#team'" class="text-slate-600 hover:text-amber-500 transition-colors">TEAM</a>
            <a :href="baseUrl + '/#about'" class="text-slate-600 hover:text-amber-500 transition-colors">ABOUT</a>
            <a :href="baseUrl + '/#works'" class="text-slate-600 hover:text-amber-500 transition-colors">WORKS</a>
            <a :href="baseUrl + '/#faq'" class="text-slate-600 hover:text-amber-500 transition-colors">FAQ</a>
            <a :href="baseUrl + '/#contact'" class="text-slate-600 hover:text-amber-500 transition-colors">CONTACT</a>
          </nav>
          <button class="md:hidden" @click="toggleMobileMenu">
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-slate-600 transition-transform duration-300"></i>
          </button>
        </div>
        <!-- モバイルメニュー -->
        <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-slate-200 relative z-60">
          <nav class="flex flex-col space-y-4">
            <a :href="baseUrl + '/#top'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">HOME</a>
            <a :href="baseUrl + '/#services'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">SERVICES</a>
            <a :href="baseUrl + '/#team'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">TEAM</a>
            <a :href="baseUrl + '/#about'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">ABOUT</a>
            <a :href="baseUrl + '/#works'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">WORKS</a>
            <a :href="baseUrl + '/#faq'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">FAQ</a>
            <a :href="baseUrl + '/#contact'" class="text-slate-600 hover:text-amber-500 transition-colors" @click="closeMobileMenu">CONTACT</a>
          </nav>
        </div>
      </div>
    </header>
    
    <!-- モバイルメニュー背景オーバーレイ（装飾付き） -->
    <div v-if="isMobileMenuOpen" 
         class="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
         @click="closeMobileMenu">
    </div>
  `,
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      this.updateBodyScroll()
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      this.updateBodyScroll()
    },
    updateBodyScroll() {
      if (this.isMobileMenuOpen) {
        // モバイルメニューが開いているときはスクロールを無効にする
        document.body.style.overflow = 'hidden'
      } else {
        // モバイルメニューが閉じているときはスクロールを有効にする
        document.body.style.overflow = ''
      }
    }
  },
  beforeUnmount() {
    // コンポーネントが破棄されるときにスクロールを復元
    document.body.style.overflow = ''
  }
} 