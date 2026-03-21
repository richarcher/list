<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { speak, cancel } from '../lib/speech'
import { playCorrect, playIncorrect } from '../lib/sounds'
import SoftKeyboard from './SoftKeyboard.vue'

const props = defineProps({
  word: { type: String, required: true },
  wordIndex: { type: Number, required: true },
  totalWords: { type: Number, required: true },
  lang: { type: String, default: 'en' },
  translation: { type: String, default: undefined },
})
const emit = defineEmits(['check', 'skip', 'next', 'back'])

const input = ref('')
const inputEl = ref(null)
const feedback = ref(null) // 'correct' | 'incorrect' | null
const showFeedback = ref(false)

const expectedWord = computed(() => props.translation ?? props.word)
const expectedWord = computed(() => props.word)

function playWord() {
  cancel()
  const textToSpeak = props.word
  const textToSpeak = props.translation ?? props.word
  speak(textToSpeak, { lang: 'en', rate: 0.85 })
}

watch(
  () => props.word,
  () => {
    input.value = ''
    feedback.value = null
    showFeedback.value = false
    nextTick(() => {
      inputEl.value?.focus()
      playWord()
    })
  },
  { immediate: true }
)

function submit() {
  const raw = input.value.trim()
  const normalized = raw.toLowerCase()
  const expected = props.word
  const correct = expected.toLowerCase() === normalized
  feedback.value = correct ? 'correct' : 'incorrect'
  showFeedback.value = true
  if (correct) {
    playCorrect()
  } else {
    playIncorrect()
  }
  emit('check', {
    correct,
    userSpelling: raw || undefined,
    translation: props.translation,
    expectedWord: expected,
  })
}

function nextWord() {
  emit('next')
}

function skip() {
  emit('skip')
}

function onKeydown(e) {
  if (e.key === 'Enter') {
    if (showFeedback.value) nextWord()
    else submit()
    return
  }
  if (e.key === 'Backspace') {
    e.preventDefault()
    input.value = input.value.slice(0, -1)
    return
  }
  if (e.key.length === 1 && /[a-z \-]/i.test(e.key)) {
    e.preventDefault()
    if (!showFeedback.value) input.value += e.key.toLowerCase()
  }
}

function onSoftKey(key) {
  if (showFeedback.value) return
  if (key === 'backspace') {
    input.value = input.value.slice(0, -1)
  } else {
    input.value += key
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-5 max-w-[28rem] mx-auto w-full">
    <button
      type="button"
      class="btn btn-ghost btn-sm self-start -ml-1"
      @click="emit('back')"
    >
      ← Back to lists
    </button>
    <p class="m-0 text-sm text-base-content/70" aria-live="polite">
      Word {{ wordIndex + 1 }} of {{ totalWords }}
    </p>
    <p class="m-0 text-lg text-base-content">
      <template v-if="lang === 'af'">
        Listen to the English word, then spell it <b>in Afrikaans</b>.
      </template>
      <template v-else>
        Listen, then spell the word <b>in English</b>.
      </template>
    </p>
    <div class="w-full">
      <button type="button" class="btn btn-neutral" @click="playWord" aria-label="Play word again">
        Play word again
      </button>
    </div>
    <div
      class="w-full flex flex-col gap-3 transition-transform duration-200"
      :class="{
        'quiz-feedback-correct': feedback === 'correct',
        'quiz-feedback-incorrect': feedback === 'incorrect'
      }"
    >
      <label for="spelling-input" class="sr-only">Your spelling</label>
      <input
        id="spelling-input"
        ref="inputEl"
        v-model="input"
        type="text"
        readonly
        inputmode="none"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        autocorrect="off"
        placeholder="Type the word..."
        class="input input-bordered w-full text-xl box-border"
        :class="{
          'input-success': feedback === 'correct',
          'input-error': feedback === 'incorrect'
        }"
        aria-label="Your spelling (use the keyboard below)"
        @keydown="onKeydown"
      />
      <SoftKeyboard :disabled="showFeedback" @key="onSoftKey" />
      <div class="flex gap-2 justify-end">
        <button type="button" class="btn btn-neutral btn-sm" @click="skip" :disabled="showFeedback">
          Skip
        </button>
        <button type="button" class="btn btn-primary btn-sm" @click="submit" :disabled="showFeedback || !input.trim()">
          Check
        </button>
      </div>
    </div>
    <div
      v-if="showFeedback"
      class="w-full box-border p-3 rounded-lg text-base"
      :class="feedback === 'correct' ? 'bg-success/15 text-success' : 'bg-error/10 text-error'"
      role="status"
    >
      <span v-if="feedback === 'correct'">Correct!</span>
      <span v-else>Not quite – the word was <strong>{{ expectedWord }}</strong>.</span>
      <button type="button" class="btn btn-primary btn-block mt-3" @click="nextWord">
        {{ wordIndex + 1 >= totalWords ? 'See results' : 'Next word' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-feedback-correct {
  animation: pulse-correct 0.5s ease;
}
.quiz-feedback-incorrect {
  animation: shake 0.4s ease;
}
@keyframes pulse-correct {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
</style>
