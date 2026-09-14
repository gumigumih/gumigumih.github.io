const textSelectors = ['.homepage .hero h1', '.subpage main h1']

const prepareTypewriter = (target) => {
  if (target.dataset.textMotionReady === 'true') return

  const label = target.textContent?.trim()
  if (!label) return

  target.dataset.textMotionReady = 'true'
  target.setAttribute('aria-label', label)

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const nodes = []
  let node = walker.nextNode()
  while (node) {
    nodes.push(node)
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
      characterElement.className = 'typewriter-char'
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
    textSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector))),
  ))
  targets.forEach((target) => {
    prepareTypewriter(target)
    const characters = Array.from(target.querySelectorAll('.typewriter-char'))
    target.classList.add('is-typing')
    characters.forEach((character, index) => {
      window.setTimeout(() => character.classList.add('is-typed'), 180 + index * 42)
    })
    window.setTimeout(() => target.classList.add('is-typed-complete'), 320 + characters.length * 42)
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextMotion, { once: true })
} else {
  initTextMotion()
}
