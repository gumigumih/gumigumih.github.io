const revealSelector = '[data-reveal], [data-reveal-item]'
const sectionSelector = '[data-reveal-section]'
const itemSelector = [
  '[data-reveal-item]',
  'article',
  '.swiper-slide',
  'form',
  '[id="contact-form"] > div',
].join(', ')

const reveal = (element: Element) => {
  element.classList.add('is-revealed')
}

const prepareItems = () => {
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const items = Array.from(group.querySelectorAll(itemSelector))
      .filter((item) => !item.closest('[data-reveal-group] [data-reveal-group]'))

    items.forEach((item, index) => {
      if (!item.hasAttribute('data-reveal-item')) {
        item.setAttribute('data-reveal-item', '')
      }
      ;(item as HTMLElement).style.setProperty('--reveal-delay', `${120 + (index % 6) * 70}ms`)
    })
  })

  document.querySelectorAll(sectionSelector).forEach((section) => {
    section.querySelectorAll('[data-reveal]').forEach((item, index) => {
      ;(item as HTMLElement).style.setProperty('--reveal-delay', `${index * 80}ms`)
    })
  })
}

const initReveal = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  prepareItems()
  document.documentElement.classList.add('reveal-ready')

  const revealTargets = Array.from(document.querySelectorAll(revealSelector))

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    revealTargets.forEach(reveal)
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        reveal(entry.target)
        observer.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12,
    },
  )

  revealTargets.forEach((target) => observer.observe(target))
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal, { once: true })
} else {
  initReveal()
}
