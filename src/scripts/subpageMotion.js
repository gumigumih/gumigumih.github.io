const motionSelectors = [
  '.breadcrumb',
  '.page-intro > *',
  '.document-content > div > section',
  '.case-hero',
  '.case-section',
  '.case-body > aside',
  '.case-body > .text-center',
  '.article-cover',
  '.article-copy > *',
  '.back-link',
]

const initSubpageMotion = () => {
  const page = document.querySelector('.subpage')
  if (!page) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targets = Array.from(new Set(
    motionSelectors.flatMap((selector) => Array.from(page.querySelectorAll(selector))),
  ))

  targets.forEach((target, index) => {
    target.dataset.subpageMotion = ''
    target.style.setProperty('--subpage-motion-delay', `${(index % 4) * 70}ms`)
    if (target.matches('.article-cover')) target.dataset.motionMedia = ''
  })

  if (!targets.length || prefersReducedMotion || !('IntersectionObserver' in window)) return

  document.documentElement.classList.add('subpage-motion-ready')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-motion-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  )

  targets.forEach((target) => observer.observe(target))
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubpageMotion, { once: true })
} else {
  initSubpageMotion()
}
