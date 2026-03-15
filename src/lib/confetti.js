const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

/**
 * Run a confetti burst (full-screen falling particles). Removes itself after ~5s.
 */
export function runConfetti() {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  const wrap = document.createElement('div')
  wrap.setAttribute('aria-hidden', 'true')
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;'

  const count = 80
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const size = 8 + Math.floor(Math.random() * 8)
    const left = Math.random() * 100
    const duration = 3 + Math.random() * 1.5
    const delay = Math.random() * 0.4
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const rotate = (Math.random() - 0.5) * 1440
    el.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
      transform: rotate(0deg);
      opacity: 1;
    `
    wrap.appendChild(el)
  }

  document.body.appendChild(wrap)
  setTimeout(() => {
    wrap.remove()
    style.remove()
  }, 5500)
}
