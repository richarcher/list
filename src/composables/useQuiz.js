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

export function useQuiz(selectedGroup) {
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
    if (!g?.words?.length) return
    cancel()
    const entries = g.words.map(({ speak, spell }) => ({ word: spell, translation: speak }))
    quizWords.value = shuffleArray(entries)
    results.value = []
    currentWordIndex.value = 0
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

  return { quizWords, currentWordIndex, currentEntry, currentWord, results, wrongWords, startQuiz, onCheck, onNext, onSkip }
}
