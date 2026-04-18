const initWorksSlider = () => {
  const SwiperGlobal = window.Swiper
  if (!SwiperGlobal) return

  const el = document.getElementById('works-slider')
  if (!el) return

  const pagination = document.getElementById('works-pagination')
  const nextEl = document.getElementById('works-next')
  const prevEl = document.getElementById('works-prev')

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
        slidesPerView: 1.7,
        spaceBetween: 20,
        snapToSlideEdge: true,
        slidesOffsetAfter: 32,
      },
      1024: {
        slidesOffsetBefore: 32,
        slidesPerView: 2.35,
        spaceBetween: 24,
        snapToSlideEdge: true,
        slidesOffsetAfter: 32,
      },
    },
    pagination: pagination
      ? {
          el: pagination,
          clickable: true,
          bulletClass: 'works-bullet',
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
  document.addEventListener('DOMContentLoaded', initWorksSlider)
} else {
  initWorksSlider()
}
