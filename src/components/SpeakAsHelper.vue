<script setup>
import { ref, computed, watch } from 'vue'
import { speak, cancel } from '../lib/speech'

const props = defineProps({
  groups: { type: Array, default: () => [] }
})
defineEmits(['back'])

const afrikaansGroups = computed(() =>
  (props.groups || []).filter((g) => g?.lang === 'af')
)

const selectedAfIndex = ref(0)
const selectedList = computed(
  () => afrikaansGroups.value[selectedAfIndex.value] ?? null
)

/** Local "speak as" values; synced from list when list changes */
const speakAsInputs = ref([])

function syncSpeakAsInputs() {
  const list = selectedList.value
  if (!list?.words) {
    speakAsInputs.value = []
    return
  }
  const existing = list.speakAs ?? []
  speakAsInputs.value = list.words.map((_, i) => existing[i] ?? '')
}

watch(selectedList, syncSpeakAsInputs, { immediate: true })

function playRow(text) {
  cancel()
  const t = (text || '').trim()
  if (t) speak(t, { lang: 'en', rate: 0.85 })
}

function copySpeakAsArray() {
  const list = selectedList.value
  if (!list?.words?.length) return
  const arr = speakAsInputs.value.slice(0, list.words.length).map((s) => {
    const t = (s || '').trim()
    return t || null
  })
  const json = JSON.stringify(arr)
  navigator.clipboard?.writeText(json).then(() => {
    copyFeedback.value = true
    setTimeout(() => { copyFeedback.value = false }, 2000)
  })
}

const copyFeedback = ref(false)
</script>

<template>
  <div class="speak-as-helper">
    <button type="button" class="btn-back" @click="$emit('back')">
      Back to quiz
    </button>
    <h1>Parent: TTS helper</h1>
    <p v-if="!afrikaansGroups.length" class="intro">
      No Afrikaans lists in the word list. Add a list with <code>lang: "af"</code> to use this helper.
    </p>
    <template v-else>
      <p class="intro">
        Use this to find text that sounds right for each word. Type in the &quot;Speak as&quot; box and press Play. When happy, copy the list and send it to update the word list.
      </p>
      <label for="helper-list-select" class="sr-only">Choose list</label>
      <select
        id="helper-list-select"
        v-model.number="selectedAfIndex"
        class="list-select"
      >
        <option
          v-for="(g, i) in afrikaansGroups"
          :key="i"
          :value="i"
        >
          {{ g.title }}
        </option>
      </select>
      <div v-if="selectedList" class="table-wrap">
        <table class="word-table">
          <thead>
            <tr>
              <th>Word</th>
              <th>In English</th>
              <th>Speak as</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(word, i) in selectedList.words" :key="i">
              <td class="col-word">{{ word }}</td>
              <td class="col-translation">{{ selectedList.translations?.[i] ?? '—' }}</td>
              <td class="col-input">
                <input
                  v-model="speakAsInputs[i]"
                  type="text"
                  class="speak-as-input"
                  :aria-label="`Speak as for ${word}`"
                />
              </td>
              <td class="col-play">
                <button
                  type="button"
                  class="btn-play"
                  aria-label="Play"
                  @click="playRow(speakAsInputs[i])"
                >
                  Play
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="copy-row">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!selectedList?.words?.length"
          @click="copySpeakAsArray"
        >
          {{ copyFeedback ? 'Copied!' : 'Copy speakAs array' }}
        </button>
      </div>
      <p class="copy-hint">Copy this and send to update the list.</p>
    </template>
  </div>
</template>

<style scoped>
.speak-as-helper {
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: left;
}
.btn-back {
  margin-bottom: 1rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.95rem;
  color: var(--text, #6b6375);
  text-decoration: underline;
  cursor: pointer;
}
.btn-back:hover {
  color: var(--text-h, #08060d);
}
.btn-back:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: var(--text-h, #08060d);
}
.intro {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  color: var(--text, #6b6375);
  line-height: 1.4;
}
.intro code {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 0.9em;
  padding: 0.1em 0.3em;
  background: var(--code-bg, #f4f3ec);
  border-radius: 3px;
}
.list-select {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--border, #e5e4e7);
  border-radius: 6px;
  margin-bottom: 1rem;
  min-width: 14rem;
  background: var(--bg, #fff);
  color: var(--text-h, #08060d);
}
.list-select:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
.table-wrap {
  overflow-x: auto;
  margin-bottom: 1rem;
}
.word-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.word-table th,
.word-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border, #e5e4e7);
  vertical-align: middle;
}
.word-table th {
  text-align: left;
  font-weight: 600;
  color: var(--text-h, #08060d);
}
.col-word {
  font-weight: 500;
}
.col-translation {
  color: var(--text, #6b6375);
}
.speak-as-input {
  width: 100%;
  min-width: 8rem;
  font-size: 0.95rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 4px;
}
.speak-as-input:focus {
  border-color: var(--accent, #aa3bff);
  outline: none;
}
.btn-play {
  font-size: 0.85rem;
  padding: 0.35rem 0.6rem;
  background: var(--code-bg, #f4f3ec);
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.btn-play:hover {
  background: var(--border, #e5e4e7);
}
.btn-play:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
.copy-row {
  margin-bottom: 0.5rem;
}
.btn {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.copy-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text, #6b6375);
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
