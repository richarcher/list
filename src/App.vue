<script setup>
import { ref, computed, onMounted } from 'vue'
import { cancel } from './lib/speech'
import ListPicker from './components/ListPicker.vue'
import Quiz from './components/Quiz.vue'
import Results from './components/Results.vue'

/** Array of { date, title, words } from wordlists.json */
const wordlists = ref([])
const screen = ref('list-picker')
const selectedIndex = ref(0)
const currentWordIndex = ref(0)
const results = ref([])
/** Shuffled words for the current quiz run (re-set on Start / Try again) */
const quizWords = ref([])

/** Lists sorted by date (newest first) for the dropdown */
const groups = computed(() => {
  const list = Array.isArray(wordlists.value) ? wordlists.value : []
  return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

const selectedGroup = computed(() => groups.value[selectedIndex.value] ?? null)
const words = computed(() => selectedGroup.value?.words ?? [])
const selectedLang = computed(() => selectedGroup.value?.lang ?? 'en')

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const currentEntry = computed(() => {
  const w = quizWords.value
  if (!w.length || currentWordIndex.value >= w.length) return null
  return w[currentWordIndex.value]
})
const currentWord = computed(() => {
  const e = currentEntry.value
  return e?.word ?? ''
})

const wrongWords = computed(() => {
  return results.value.filter((r) => !r.correct)
})

function loadWordlists() {
  fetch('/wordlists.json')
    .then((r) => r.json())
    .then((data) => {
      wordlists.value = Array.isArray(data) ? data : []
      if (groups.value.length && selectedIndex.value >= groups.value.length) {
        selectedIndex.value = 0
      }
    })
    .catch(() => {
      wordlists.value = []
    })
}

function startQuiz() {
  if (!words.value.length) return
  cancel()
  const g = selectedGroup.value
  const wordsList = g?.words ?? []
  const translationsList = g?.translations ?? []
  const entries = wordsList.map((word, i) => ({
    word,
    translation: translationsList[i]
  }))
  quizWords.value = shuffleArray(entries)
  results.value = []
  currentWordIndex.value = 0
  screen.value = 'quiz'
}

function onCheck(payload) {
  const { correct, userSpelling, translation, expectedWord } = payload
  results.value.push({ word: expectedWord ?? currentWord.value, correct, userSpelling, translation })
}

function onNext() {
  if (currentWordIndex.value + 1 >= quizWords.value.length) {
    screen.value = 'results'
    return
  }
  currentWordIndex.value += 1
}

function onSkip() {
  const entry = currentEntry.value
  const expectedWord = entry?.translation ?? currentWord.value
  results.value.push({
    word: expectedWord,
    correct: false,
    userSpelling: undefined,
    translation: entry?.translation
  })
  onNext()
}

function tryAgain() {
  startQuiz()
}

function pickAnotherList() {
  screen.value = 'list-picker'
  if (groups.value.length) selectedIndex.value = 0
}

function selectList(index) {
  selectedIndex.value = Number(index)
}

onMounted(loadWordlists)
</script>

<template>
  <div id="app" lang="en-ZA" class="min-h-screen flex flex-col">
    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <ListPicker
        v-if="screen === 'list-picker'"
        :groups="groups"
        :selected-index="selectedIndex"
        @select="selectList($event)"
        @start="startQuiz"
      />
      <Quiz
        v-else-if="screen === 'quiz' && currentWord"
        :word="currentWord"
        :word-index="currentWordIndex"
        :total-words="quizWords.length"
        :lang="selectedLang"
        :translation="currentEntry?.translation"
        @check="onCheck"
        @skip="onSkip"
        @next="onNext"
      />
      <Results
        v-else-if="screen === 'results'"
        :score="results.filter((r) => r.correct).length"
        :total="results.length"
        :wrong-words="wrongWords"
        @try-again="tryAgain"
        @pick-another-date="pickAnotherList"
      />
    </main>
  </div>
</template>
