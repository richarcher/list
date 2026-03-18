const LOCALE = 'en-GB'

/**
 * Prefer on-device voices (localService === true) when available.
 * This often sounds less robotic than browser defaults.
 * @returns {SpeechSynthesisVoice | null}
 */
function getPreferredVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(LOCALE.toLowerCase()))
  if (!voices.length) return null
  const local = voices.find((v) => v.localService)
  if (local) return local
  const def = voices.find((v) => v.default)
  if (def) return def
  return voices[0]
}

/**
 * Speak text using the Web Speech API.
 * This app always speaks the English prompt.
 * @param {string} text
 * @param {object} options - { rate?, pitch?, lang? } lang is ignored; kept for backward compatibility.
 */
export function speak(text, options = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(String(text))
  utterance.lang = LOCALE
  utterance.rate = options.rate ?? 0.9
  utterance.pitch = options.pitch ?? 1

  const voice = getPreferredVoice()
  if (voice) utterance.voice = voice

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
