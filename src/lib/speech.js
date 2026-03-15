const LANG_TO_LOCALE = {
  en: 'en-ZA',
  af: 'af-ZA'
}

/**
 * Speak text using the Web Speech API.
 * @param {string} text
 * @param {object} options - { lang?, rate?, pitch? } lang: "en" | "af", default "en"
 */
export function speak(text, options = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const lang = options.lang && LANG_TO_LOCALE[options.lang] ? LANG_TO_LOCALE[options.lang] : 'en-ZA'
  const utterance = new SpeechSynthesisUtterance(String(text))
  utterance.lang = lang
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
