const textSelectors = [
  '.homepage .hero h1',
  '.homepage .section-heading h2',
  '.subpage main h1',
  '.subpage main h2',
]

const splitText = (target: HTMLElement) => {
  if (target.dataset.textMotionReady === 'true') return

  const label = target.textContent?.trim()
  if (!label) return

  target.dataset.textMotionReady = 'true'
  target.setAttribute('aria-label', label)

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let node = walker.nextNode()
  while (node) {
    nodes.push(node as Text)
    node = walker.nextNode()
  }

  let index = 0
  nodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment()
    Array.from(textNode.textContent || '').forEach((character) => {
      if (/\s/.test(character)) {
        fragment.append(character)
        return
      }

      const characterElement = document.createElement('span')
      characterElement.className = 'text-char'
      characterElement.setAttribute('aria-hidden', 'true')
      characterElement.style.setProperty('--char-index', String(index))
      characterElement.textContent = character
      fragment.append(characterElement)
      index += 1
    })
    textNode.replaceWith(fragment)
  })
}

const initTextMotion = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const targets = Array.from(new Set(
    textSelectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector))),
  ))
  targets.forEach(splitText)

  requestAnimationFrame(() => document.documentElement.classList.add('text-motion-ready'))
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextMotion, { once: true })
} else {
  initTextMotion()
}
