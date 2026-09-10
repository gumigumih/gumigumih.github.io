const sectionIds = ['top', 'services', 'works', 'profile', 'work-style', 'contact']

const initActiveSectionNav = () => {
  if (!document.body.classList.contains('homepage')) return

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null)
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section-nav]'))

  if (!sections.length || !links.length) return

  const setActive = (id: string) => {
    links.forEach((link) => {
      const isActive = link.hash === `#${id}` || (id === 'top' && link.hash === '')
      if (isActive) {
        link.setAttribute('aria-current', 'page')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  const updateActive = () => {
    const offset = window.innerHeight * 0.34
    const current = sections.reduce((active, section) => (
      section.getBoundingClientRect().top <= offset ? section : active
    ), sections[0])
    setActive(current.id)
  }

  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      updateActive()
      ticking = false
    })
  }

  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initActiveSectionNav, { once: true })
} else {
  initActiveSectionNav()
}
