import Swiper from 'swiper/bundle'

export function initArticleList() {
  const wrapper = document.getElementById('articles-wrapper')
  if (!wrapper) return

  const initSwiper = (root) => {
    const nextButton = root.querySelector('.swiper-button-next')
    const prevButton = root.querySelector('.swiper-button-prev')
    const pagination = root.querySelector('.swiper-pagination')
    const swiper = new Swiper(root, {
      slidesPerView: 1,
      spaceBetween: 10,
      // loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: pagination, clickable: true, dynamicBullets: true },
      navigation: { nextEl: nextButton, prevEl: prevButton, disabledClass: 'swiper-button-disabled' },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    })

    root.addEventListener('mouseenter', () => swiper.autoplay?.stop())
    root.addEventListener('mouseleave', () => swiper.autoplay?.start())
  }

  const root = wrapper.closest('.swiper')
  if (root) initSwiper(root)
}

initArticleList()
