const LOCALE = 'en-ZA'

/**
 * Speak text using the Web Speech API (en-ZA).
 * @param {string} text
 * @param {object} options - { rate?, pitch? }
 */
export function speak(text, options = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(String(text))
  utterance.lang = LOCALE
  utterance.rate = options.rate ?? 0.9
  utterance.pitch = options.pitch ?? 1
  window.speechSynthesis.speak(utterance)
}

/**
 * Stop any current speech.
 */
export function cancel() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
