import Swiper from 'swiper/bundle'

const wrapper = document.getElementById('articles-wrapper') as HTMLElement | null

if (wrapper) {
  const initSwiper = (root: Element) => {
    const nextButton = root.querySelector('.swiper-button-next') as HTMLElement | null
    const prevButton = root.querySelector('.swiper-button-prev') as HTMLElement | null
    const pagination = root.querySelector('.swiper-pagination') as HTMLElement | null
    new Swiper(root as HTMLElement, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: pagination as any, clickable: true, dynamicBullets: true },
      navigation: { nextEl: nextButton as any, prevEl: prevButton as any, disabledClass: 'swiper-button-disabled' },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    })
  }

  const root = wrapper.closest('.swiper')
  if (root) initSwiper(root)
}
