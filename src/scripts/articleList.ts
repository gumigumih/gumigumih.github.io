import Swiper from 'swiper/bundle'

const wrapper = document.getElementById('articles-wrapper') as HTMLElement | null
if (wrapper) {
  const buildArticlesUrl = () => {
    const BASE = (import.meta.env.BASE_URL || '/') as string
    const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE
    return `${base}/articles.json`
  }

  const formatDate = (s: string) => new Date(s).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  const getArticleUrl = (a: any) => {
    switch (a.type) {
      case 'note': return `https://note.com/gumigumih/n/${a.key}`
      case 'qiita': return `https://qiita.com/gumigumih/items/${a.key}`
      case 'zenn': return `https://zenn.dev/gumigumih/articles/${a.key}`
      default: return `https://note.com/gumigumih/n/${a.key}`
    }
  }

  const initSwiper = (root: Element) => {
    const nextButton = root.querySelector('.swiper-button-next') as HTMLElement | null
    const prevButton = root.querySelector('.swiper-button-prev') as HTMLElement | null
    const pagination = root.querySelector('.swiper-pagination') as HTMLElement | null
    new Swiper(root as HTMLElement, {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: pagination as any, clickable: true, dynamicBullets: true },
      navigation: { nextEl: nextButton as any, prevEl: prevButton as any, disabledClass: 'swiper-button-disabled' },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 24 },
        768: { slidesPerView: 2, spaceBetween: 32 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      },
    })
  }

  const load = async () => {
    try {
      const res = await fetch(buildArticlesUrl())
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const articles = data?.data?.contents ?? []
      const slides = (articles as any[]).map(a => {
        const img = a.localImagePath || a.eyecatch
        const tags = (a.hashtags || []).map((t: any) => `<span class="text-sm text-slate-500">${t.hashtag.name}</span>`).join('')
        return `
          <div class="swiper-slide">
            <a href="${getArticleUrl(a)}" target="_blank" rel="noopener noreferrer" class="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-b-4 border-slate-400 hover:shadow-xl hover:border-slate-500 transform transition-all duration-200 block">
              <div class="aspect-[1200/630] mb-6 overflow-hidden rounded-lg">
                <img src="${img}" alt="${a.name}" class="w-full h-full object-cover" />
              </div>
              <div class="flex items-center gap-2 mb-4">
                <h3 class="text-xl font-bold text-slate-800 font-raleway">${a.name}</h3>
              </div>
              <div class="flex flex-wrap gap-2 mt-4">${tags}</div>
              <p class="text-slate-500 text-sm mt-4">${formatDate(a.publishAt)}</p>
            </a>
          </div>`
      }).join('')

      wrapper.innerHTML = slides
      const root = wrapper.closest('.swiper')
      if (root) initSwiper(root)
    } catch (e) {
      console.error('記事の読み込みに失敗しました:', e)
      const root = wrapper.closest('.swiper')
      if (root) initSwiper(root)
    }
  }

  load()
}

