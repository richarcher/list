import { ref, computed } from 'vue'
import { cancel } from '../lib/speech'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dedupeWordPool(groups, lang) {
  const seen = new Set()
  const out = []
  for (const g of groups) {
    if (g.lang !== lang) continue
    for (const w of g.words ?? []) {
      const key = `${w.speak}\0${w.spell}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ word: w.spell, translation: w.speak })
    }
  }
  return out
}

/** How many unique words exist across all lists for this language (for Mega buttons). */
export function countMegaPoolWords(groups, lang) {
  return dedupeWordPool(groups ?? [], lang).length
}

export function useQuiz(selectedGroup, groups) {
  const quizWords = ref([])
  const currentWordIndex = ref(0)
  const results = ref([])

  const currentEntry = computed(() => {
    const w = quizWords.value
    if (!w.length || currentWordIndex.value >= w.length) return null
    return w[currentWordIndex.value]
  })

  const currentWord = computed(() => currentEntry.value?.word ?? '')

  const wrongWords = computed(() => results.value.filter((r) => !r.correct))

  function startQuiz() {
    const g = selectedGroup.value
    if (!g?.words?.length) return false
    cancel()
    const entries = g.words.map(({ speak, spell }) => ({ word: spell, translation: speak }))
    quizWords.value = shuffleArray(entries)
    results.value = []
    currentWordIndex.value = 0
    return true
  }

  /**
   * Up to 10 random words from all lists with the given `lang` (English or Afrikaans only — not mixed).
   * @returns {boolean} false if there are no words in the pool
   */
  function startMegaQuiz(lang) {
    const pool = dedupeWordPool(groups.value ?? [], lang)
    if (!pool.length) return false
    cancel()
    quizWords.value = shuffleArray(pool).slice(0, Math.min(10, pool.length))
    results.value = []
    currentWordIndex.value = 0
    return true
  }

  function onCheck(payload) {
    const { correct, userSpelling, translation, expectedWord } = payload
    results.value.push({ word: expectedWord ?? currentWord.value, correct, userSpelling, translation })
  }

  function onNext() {
    if (currentWordIndex.value + 1 >= quizWords.value.length) return true // signals end
    currentWordIndex.value += 1
    return false
  }

  function onSkip() {
    const entry = currentEntry.value
    results.value.push({
      word: entry?.word ?? currentWord.value,
      correct: false,
      userSpelling: undefined,
      translation: entry?.translation,
    })
    return onNext()
  }

  return {
    quizWords,
    currentWordIndex,
    currentEntry,
    currentWord,
    results,
    wrongWords,
    startQuiz,
    startMegaQuiz,
    onCheck,
    onNext,
    onSkip,
  }
}
