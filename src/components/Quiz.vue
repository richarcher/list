<script setup>
import { ref, watch, nextTick } from 'vue'
import { speak, cancel } from '../lib/speech'
import { playCorrect, playIncorrect } from '../lib/sounds'
import SoftKeyboard from './SoftKeyboard.vue'

const props = defineProps({
  word: { type: String, required: true },
  wordIndex: { type: Number, required: true },
  totalWords: { type: Number, required: true }
})
const emit = defineEmits(['check', 'skip', 'next'])

const input = ref('')
const inputEl = ref(null)
const feedback = ref(null) // 'correct' | 'incorrect' | null
const showFeedback = ref(false)

function playWord() {
  cancel()
  speak(props.word, { rate: 0.85 })
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
  const correct = props.word.toLowerCase() === normalized
  feedback.value = correct ? 'correct' : 'incorrect'
  showFeedback.value = true
  if (correct) {
    playCorrect()
  } else {
    playIncorrect()
  }
  emit('check', { correct, userSpelling: raw || undefined })
}

function nextWord() {
  emit('next')
}

function skip() {
  emit('skip')
}

function onKeydown(e) {
  if (e.key === 'Enter') {
    submit()
    return
  }
  if (e.key === 'Backspace') {
    e.preventDefault()
    input.value = input.value.slice(0, -1)
    return
  }
  if (e.key.length === 1 && /[a-z ]/i.test(e.key)) {
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
  <div class="quiz">
    <p class="progress" aria-live="polite">
      Word {{ wordIndex + 1 }} of {{ totalWords }}
    </p>
    <p class="instruction">Listen, then spell the word.</p>
    <div class="play-row">
      <button type="button" class="btn btn-secondary" @click="playWord" aria-label="Play word again">
        Play word again
      </button>
    </div>
    <div class="input-row" :class="{ 'feedback-correct': feedback === 'correct', 'feedback-incorrect': feedback === 'incorrect' }">
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
        :disabled="showFeedback"
        placeholder="Type the word..."
        class="spelling-input"
        aria-label="Your spelling (use the keyboard below)"
        @keydown="onKeydown"
      />
      <SoftKeyboard :disabled="showFeedback" @key="onSoftKey" />
      <div class="actions">
        <button type="button" class="btn btn-secondary" @click="skip" :disabled="showFeedback">
          Skip
        </button>
        <button type="button" class="btn btn-primary" @click="submit" :disabled="showFeedback || !input.trim()">
          Check
        </button>
      </div>
    </div>
    <div v-if="showFeedback" class="feedback" :class="feedback" role="status">
      <span v-if="feedback === 'correct'" class="feedback-correct-text">Correct!</span>
      <span v-else class="feedback-incorrect-text">Not quite – the word was <strong>{{ word }}</strong>.</span>
      <button type="button" class="btn btn-primary btn-next" @click="nextWord">
        {{ wordIndex + 1 >= totalWords ? 'See results' : 'Next word' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem;
  max-width: 28rem;
  margin: 0 auto;
}
.progress {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text, #6b6375);
}
.instruction {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-h, #08060d);
}
.play-row {
  width: 100%;
}
.btn {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
}
.btn:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--accent, #aa3bff);
  color: #fff;
  border-color: var(--accent, #aa3bff);
}
.btn-secondary {
  background: var(--code-bg, #f4f3ec);
  color: var(--text-h, #08060d);
  border-color: var(--border, #e5e4e7);
}
.input-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease;
}
.input-row.feedback-correct {
  animation: pulse-correct 0.5s ease;
}
.input-row.feedback-incorrect {
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
.spelling-input {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.25rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border, #e5e4e7);
  border-radius: 8px;
}
.spelling-input:focus {
  border-color: var(--accent, #aa3bff);
  outline: none;
}
.input-row.feedback-incorrect .spelling-input {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.06);
}
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.feedback {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1.05rem;
  width: 100%;
  box-sizing: border-box;
}
.feedback.correct {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
  animation: fadeIn 0.3s ease;
}
.feedback.incorrect {
  background: rgba(220, 38, 38, 0.08);
  color: #b91c1c;
  animation: fadeIn 0.3s ease;
}
.btn-next {
  margin-top: 0.75rem;
  display: block;
  width: 100%;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
