/**
 * Resolve when speech synthesis voices are ready (handles Chrome async loading).
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function whenVoicesReady() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }
  const list = window.speechSynthesis.getVoices()
  if (list.length > 0) {
    return Promise.resolve(list)
  }
  return new Promise((resolve) => {
    const onVoices = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoices)
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      resolve(window.speechSynthesis.getVoices())
    }, 500)
  })
}

/**
 * Check if any voice is available for the given language (e.g. "af" matches "af", "af-ZA").
 * Call after whenVoicesReady() for reliable result.
 * @param {string} lang - "en" | "af"
 * @returns {boolean}
 */
export function hasVoiceForLang(lang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  const voices = window.speechSynthesis.getVoices()
  const prefix = String(lang).toLowerCase()
  return voices.some((v) => v.lang.toLowerCase().startsWith(prefix))
}
