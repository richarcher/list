<script setup>
import { onMounted } from 'vue'
import { characterDiff } from '../lib/diff'
import { runConfetti } from '../lib/confetti'
import { playFanfare } from '../lib/sounds'

const props = defineProps({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  wrongWords: { type: Array, default: () => [] }
})
defineEmits(['tryAgain', 'pickAnotherDate'])

function getDiff(correct, userSpelling) {
  return characterDiff(correct, userSpelling ?? '')
}

onMounted(() => {
  if (props.total > 0 && props.score === props.total) {
    runConfetti()
    playFanfare()
  }
})
</script>

<template>
  <div class="results">
    <h1>Well done!</h1>
    <p v-if="total > 0 && score === total" class="full-marks" role="status">
      Full marks!
    </p>
    <p class="score" aria-live="polite">
      You got <strong>{{ score }}</strong> out of <strong>{{ total }}</strong> correct.
    </p>
    <section v-if="wrongWords.length" class="wrong-section" aria-labelledby="wrong-heading">
      <h2 id="wrong-heading">Words to practise</h2>
      <p class="hint">Here’s the difference between what you wrote and the correct spelling.</p>
      <ul class="wrong-list">
        <li v-for="(item, i) in wrongWords" :key="i" class="wrong-item">
          <div class="wrong-row">
            <span class="wrong-label">You wrote:</span>
            <span class="wrong-spelling">
              <template v-for="(seg, j) in getDiff(item.word, item.userSpelling).userSegments" :key="j">
                <span v-if="seg.type === 'same'" class="diff-same">{{ seg.char }}</span>
                <span v-else-if="seg.type === 'remove'" class="diff-wrong">{{ seg.char || '·' }}</span>
              </template>
            </span>
          </div>
          <div class="wrong-row">
            <span class="wrong-label">Correct:</span>
            <span class="correct-spelling">
              <template v-for="(seg, j) in getDiff(item.word, item.userSpelling).correctSegments" :key="j">
                <span v-if="seg.type === 'same'" class="diff-same">{{ seg.char }}</span>
                <span v-else-if="seg.type === 'add'" class="diff-missing">{{ seg.char || '·' }}</span>
              </template>
            </span>
          </div>
        </li>
      </ul>
    </section>
    <div class="actions">
      <button type="button" class="btn btn-secondary" @click="$emit('tryAgain')">
        Try again
      </button>
      <button type="button" class="btn btn-primary" @click="$emit('pickAnotherDate')">
        Pick another list
      </button>
    </div>
  </div>
</template>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 32rem;
  margin: 0 auto;
}
h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text-h, #08060d);
}
.full-marks {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #15803d;
}
.score {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text, #6b6375);
}
.score strong {
  color: var(--text-h, #08060d);
}
.wrong-section {
  width: 100%;
  text-align: left;
}
.wrong-section h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--text-h, #08060d);
}
.wrong-section .hint {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--text, #6b6375);
}
.wrong-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.wrong-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border, #e5e4e7);
}
.wrong-item:last-child {
  border-bottom: none;
}
.wrong-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  margin-bottom: 0.25rem;
}
.wrong-row:last-child {
  margin-bottom: 0;
}
.wrong-label {
  flex-shrink: 0;
  font-size: 0.9rem;
  color: var(--text, #6b6375);
  min-width: 5.5rem;
}
.wrong-spelling,
.correct-spelling {
  font-family: var(--mono, ui-monospace, Consolas, monospace);
  font-size: 1.05rem;
  letter-spacing: 0.02em;
}
.diff-same {
  color: var(--text-h, #08060d);
}
.diff-wrong {
  color: #b91c1c;
  text-decoration: underline;
  text-decoration-style: wavy;
}
.diff-missing {
  color: #15803d;
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  font-size: 1rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
}
.btn:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
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
</style>
