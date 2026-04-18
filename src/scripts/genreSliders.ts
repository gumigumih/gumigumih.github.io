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
      slidesPerView: 1.05,
      spaceBetween: 16,
      breakpoints: {
        768: {
          slidesPerView: 1.6,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 24,
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
