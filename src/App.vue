<script setup>
import { onMounted, ref } from 'vue'
import { useWordlists } from './composables/useWordlists'
import { useQuiz } from './composables/useQuiz'
import ListPicker from './components/ListPicker.vue'
import Quiz from './components/Quiz.vue'
import Results from './components/Results.vue'

const screen = ref('list-picker')

const { groups, selectedIndex, selectedGroup, selectedLang, loadWordlists, selectList } = useWordlists()
const { quizWords, currentWordIndex, currentEntry, currentWord, results, wrongWords, startQuiz, onCheck, onNext, onSkip } = useQuiz(selectedGroup)

function handleNext() {
  const finished = onNext()
  if (finished) screen.value = 'results'
}

function handleSkip() {
  const finished = onSkip()
  if (finished) screen.value = 'results'
}

function startAndNavigate() {
  startQuiz()
  screen.value = 'quiz'
}

function pickAnotherList() {
  screen.value = 'list-picker'
  if (groups.value.length) selectedIndex.value = 0
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
        @start="startAndNavigate"
      />
      <Quiz
        v-else-if="screen === 'quiz' && currentWord"
        :word="currentWord"
        :word-index="currentWordIndex"
        :total-words="quizWords.length"
        :lang="selectedLang"
        :translation="currentEntry?.translation"
        @check="onCheck"
        @skip="handleSkip"
        @next="handleNext"
      />
      <Results
        v-else-if="screen === 'results'"
        :score="results.filter((r) => r.correct).length"
        :total="results.length"
        :wrong-words="wrongWords"
        @try-again="startAndNavigate"
        @pick-another-date="pickAnotherList"
      />
    </main>
  </div>
</template>
