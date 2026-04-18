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
    slidesOffsetBefore: 32,
    slidesPerView: 1.08,
    spaceBetween: 16,
    snapToSlideEdge: true,
    slidesOffsetAfter: 32,
    breakpoints: {
      768: {
        slidesOffsetBefore: 32,
        slidesPerView: 2.1,
        spaceBetween: 24,
        snapToSlideEdge: true,
        slidesOffsetAfter: 32,
      },
      1024: {
        slidesOffsetBefore: 32,
        slidesPerView: 3.25,
        spaceBetween: 24,
        snapToSlideEdge: true,
        slidesOffsetAfter: 32,
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
