import Swiper from 'swiper/bundle'

const initSectionSliders = () => {
  const roots = document.querySelectorAll<HTMLElement>('[data-section-slider-root]')

  roots.forEach((root) => {
    const sliderEl = root.querySelector<HTMLElement>('[data-section-slider]')
    if (!sliderEl) return

    const pagination = root.querySelector<HTMLElement>('[data-section-pagination]')
    const nextEl = root.querySelector<HTMLElement>('[data-section-next]')
    const prevEl = root.querySelector<HTMLElement>('[data-section-prev]')

    const slidesPerView = Number(root.dataset.slidesPerView ?? '1')
    const mediumSlidesPerView = Number(root.dataset.mediumSlidesPerView ?? slidesPerView)
    const largeSlidesPerView = Number(root.dataset.largeSlidesPerView ?? mediumSlidesPerView)
    const smallSpaceBetween = Number(root.dataset.smallSpaceBetween ?? '16')
    const mediumSpaceBetween = Number(root.dataset.mediumSpaceBetween ?? smallSpaceBetween)
    const largeSpaceBetween = Number(root.dataset.largeSpaceBetween ?? mediumSpaceBetween)

    // eslint-disable-next-line no-new
    new Swiper(sliderEl, {
      slidesPerView,
      spaceBetween: smallSpaceBetween,
      autoHeight: true,
      breakpoints: {
        768: {
          slidesPerView: mediumSlidesPerView,
          spaceBetween: mediumSpaceBetween,
        },
        1024: {
          slidesPerView: largeSlidesPerView,
          spaceBetween: largeSpaceBetween,
        },
      },
      pagination: pagination
        ? {
            el: pagination,
            clickable: true,
            bulletClass: 'section-bullet',
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
  document.addEventListener('DOMContentLoaded', initSectionSliders)
} else {
  initSectionSliders()
}
