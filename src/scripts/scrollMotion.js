const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)

const initScrollMotion = () => {
  if (!document.body.classList.contains('homepage')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const hero = document.querySelector('.hero')
  const sections = Array.from(document.querySelectorAll('.design-section'))
  let ticking = false

  const updateMotion = () => {
    const viewportHeight = window.innerHeight

    if (hero) {
      const rect = hero.getBoundingClientRect()
      const progress = clamp(-rect.top / Math.max(rect.height * 0.9, 1))
      hero.style.setProperty('--hero-progress', progress.toFixed(3))
      hero.style.setProperty('--hero-shift', `${(progress * 42).toFixed(1)}px`)
    }

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const progress = clamp((viewportHeight * 0.82 - rect.top) / (viewportHeight * 0.38))
      section.style.setProperty('--section-progress', progress.toFixed(3))
    })

    ticking = false
  }

  const requestUpdate = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateMotion)
  }

  updateMotion()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollMotion, { once: true })
} else {
  initScrollMotion()
}
