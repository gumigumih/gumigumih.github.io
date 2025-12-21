const initArticlesSlider = () => {
  const SwiperGlobal = window.Swiper
  if (!SwiperGlobal) return

  const el = document.getElementById('articles-slider')
  if (!el) return

  const pagination = document.getElementById('articles-pagination')
  const nextEl = document.getElementById('articles-next')
  const prevEl = document.getElementById('articles-prev')

  // eslint-disable-next-line no-new
  new SwiperGlobal(el, {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
    pagination: pagination
      ? {
          el: pagination,
          clickable: true,
          bulletClass: 'articles-bullet',
          bulletActiveClass: 'is-active',
        }
      : undefined,
    navigation:
      nextEl && prevEl
        ? {
            nextEl,
            prevEl,
          }
        : undefined,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticlesSlider)
} else {
  initArticlesSlider()
}
