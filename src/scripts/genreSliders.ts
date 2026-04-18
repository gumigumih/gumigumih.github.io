import Swiper from 'swiper/bundle'

const initGenreSliders = () => {
  const roots = document.querySelectorAll<HTMLElement>('[data-genre-slider-root]')

  roots.forEach((root) => {
    const sliderEl = root.querySelector<HTMLElement>('[data-genre-slider]')
    if (!sliderEl) return

    const pagination = root.querySelector<HTMLElement>('[data-genre-pagination]')
    const nextEl = root.querySelector<HTMLElement>('[data-genre-next]')
    const prevEl = root.querySelector<HTMLElement>('[data-genre-prev]')

    // eslint-disable-next-line no-new
    new Swiper(sliderEl, {
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
            bulletClass: 'genre-bullet',
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
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGenreSliders)
} else {
  initGenreSliders()
}
