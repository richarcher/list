<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useWordlists } from './composables/useWordlists'
import { useQuiz, countMegaPoolWords } from './composables/useQuiz'
import { useOnline } from './composables/useOnline'
import ListPicker from './components/ListPicker.vue'
import Quiz from './components/Quiz.vue'
import Results from './components/Results.vue'
import UpdatePrompt from './components/UpdatePrompt.vue'
import OfflineFallback from './components/OfflineFallback.vue'

const screen = ref('list-picker')
/** When set, quiz is a Mega-test / Mega-toets (try again repeats mega). */
const megaLang = ref(null)
/** Final stopwatch ms from last mega run (shown on results). */
const megaElapsedMs = ref(null)

const { groups, selectedIndex, selectedGroup, selectedLang, loadWordlists, selectList, loadState } =
  useWordlists()
const { quizWords, currentWordIndex, currentEntry, currentWord, results, wrongWords, startQuiz, startMegaQuiz, onCheck, onNext, onSkip } =
  useQuiz(selectedGroup, groups)

const { isOnline } = useOnline()

const swRegistration = ref(null)
let swIntervalId
let onVisibility

const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(_swUrl, r) {
    if (swIntervalId) clearInterval(swIntervalId)
    if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)

    swRegistration.value = r ?? null
    if (!r) return

    swIntervalId = setInterval(() => {
      r.update()
    }, 60 * 60 * 1000)

    onVisibility = () => {
      if (document.visibilityState === 'visible') r.update()
    }
    document.addEventListener('visibilitychange', onVisibility)
  },
})

const buildId = __BUILD_ID__
const buildStamp = __BUILD_STAMP__

const builtAtLabel = computed(() => {
  const s = buildStamp
  return s.length >= 16 ? `${s.slice(0, 10)} ${s.slice(11, 16)}` : s
})

const showListLoadFailure = computed(
  () => screen.value === 'list-picker' && loadState.value === 'error' && groups.value.length === 0
)

const offlineFallbackMessage = computed(() =>
  isOnline.value
    ? 'Word lists could not be loaded. Check your connection and try again.'
    : 'You appear to be offline. Connect to the internet to load word lists.'
)

const megaEnAvailable = computed(() => countMegaPoolWords(groups.value, 'en') > 0)
const megaAfAvailable = computed(() => countMegaPoolWords(groups.value, 'af') > 0)

const quizLang = computed(() => megaLang.value ?? selectedLang.value)

const megaResultsLabel = computed(() => {
  if (megaLang.value === 'af') return 'Mega-toets'
  if (megaLang.value === 'en') return 'Mega-test'
  return null
})

function handleNext(payload) {
  const finished = onNext()
  if (finished) {
    megaElapsedMs.value =
      payload && typeof payload === 'object' && 'megaElapsedMs' in payload
        ? payload.megaElapsedMs
        : null
    screen.value = 'results'
  }
}

function handleSkip(payload) {
  const finished = onSkip()
  if (finished) {
    megaElapsedMs.value =
      payload && typeof payload === 'object' && 'megaElapsedMs' in payload
        ? payload.megaElapsedMs
        : null
    screen.value = 'results'
  }
}

function startAndNavigate() {
  if (!startQuiz()) return
  megaLang.value = null
  megaElapsedMs.value = null
  screen.value = 'quiz'
}

function startMegaNavigate(lang) {
  if (!startMegaQuiz(lang)) return
  megaLang.value = lang
  megaElapsedMs.value = null
  screen.value = 'quiz'
}

function pickAnotherList() {
  megaLang.value = null
  megaElapsedMs.value = null
  screen.value = 'list-picker'
  if (groups.value.length) selectedIndex.value = 0
}

function tryAgain() {
  megaElapsedMs.value = null
  if (megaLang.value) {
    if (!startMegaQuiz(megaLang.value)) return
  } else {
    if (!startQuiz()) return
  }
  screen.value = 'quiz'
}

function backToLists() {
  megaLang.value = null
  megaElapsedMs.value = null
  screen.value = 'list-picker'
}

function checkForUpdates() {
  swRegistration.value?.update().catch(() => {})
}

async function reloadToUpdate() {
  await updateServiceWorker()
}

onMounted(loadWordlists)

onUnmounted(() => {
  if (swIntervalId) clearInterval(swIntervalId)
  if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div id="app" lang="en-ZA" class="min-h-app flex flex-col">
    <UpdatePrompt :visible="needRefresh" @reload="reloadToUpdate" />

    <header
      class="w-full flex justify-end items-center px-3 py-2 min-h-[2.5rem] border-b border-base-300/60"
      aria-label="App status"
    >
      <span v-if="!isOnline" class="badge badge-warning badge-outline text-xs font-medium">
        Offline
      </span>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <OfflineFallback
        v-if="showListLoadFailure"
        :message="offlineFallbackMessage"
        @retry="loadWordlists"
      />
      <ListPicker
        v-else-if="screen === 'list-picker'"
        :groups="groups"
        :selected-index="selectedIndex"
        :mega-en-available="megaEnAvailable"
        :mega-af-available="megaAfAvailable"
        @select="selectList($event)"
        @start="startAndNavigate"
        @mega-start="startMegaNavigate"
      />
      <Quiz
        v-else-if="screen === 'quiz' && currentWord"
        :word="currentWord"
        :word-index="currentWordIndex"
        :total-words="quizWords.length"
        :lang="quizLang"
        :translation="currentEntry?.translation"
        :mega-mode="!!megaLang"
        @check="onCheck"
        @skip="handleSkip"
        @next="handleNext"
        @back="backToLists"
      />
      <Results
        v-else-if="screen === 'results'"
        :score="results.filter((r) => r.correct).length"
        :total="results.length"
        :wrong-words="wrongWords"
        :mega-elapsed-ms="megaElapsedMs"
        :mega-label="megaResultsLabel"
        @try-again="tryAgain"
        @pick-another-date="pickAnotherList"
      />
    </main>

    <footer
      v-if="screen === 'list-picker'"
      class="w-full border-t border-base-300/60 px-4 pt-4 text-center text-xs text-base-content/60 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
    >
      <div class="flex flex-col gap-1.5 justify-center items-center">
        <div class="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
          <span>
            List &amp; Lys ·
            <span class="text-base-content/80 font-mono tracking-tight">{{ buildId }}</span>
            <span class="text-base-content/50"> · built {{ builtAtLabel }}</span>
          </span>
          <button type="button" class="link link-primary text-xs" @click="checkForUpdates">
            Check for updates
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
