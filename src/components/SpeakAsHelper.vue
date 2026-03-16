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
  <div class="w-full max-w-[36rem] mx-auto py-8 px-4 text-left">
    <button type="button" class="btn btn-ghost btn-sm mb-4 link link-hover text-base-content/70" @click="$emit('back')">
      Back to quiz
    </button>
    <h1 class="m-0 mb-2 text-2xl text-base-content">Parent: TTS helper</h1>
    <p v-if="!afrikaansGroups.length" class="m-0 mb-4 text-base text-base-content/70 leading-relaxed">
      No Afrikaans lists in the word list. Add a list with <code class="font-mono text-sm px-1 py-0.5 bg-base-200 rounded">lang: "af"</code> to use this helper.
    </p>
    <template v-else>
      <p class="m-0 mb-4 text-base text-base-content/70 leading-relaxed">
        Use this to find text that sounds right for each word. Type in the &quot;Speak as&quot; box and press Play. When happy, copy the list and send it to update the word list.
      </p>
      <label for="helper-list-select" class="sr-only">Choose list</label>
      <select
        id="helper-list-select"
        v-model.number="selectedAfIndex"
        class="select select-bordered mb-4 min-w-[14rem]"
      >
        <option
          v-for="(g, i) in afrikaansGroups"
          :key="i"
          :value="i"
        >
          {{ g.title }}
        </option>
      </select>
      <div v-if="selectedList" class="overflow-x-auto mb-4">
        <table class="table table-zebra">
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
              <td class="font-medium">{{ word }}</td>
              <td class="text-base-content/70">{{ selectedList.translations?.[i] ?? '—' }}</td>
              <td>
                <input
                  v-model="speakAsInputs[i]"
                  type="text"
                  class="input input-bordered input-sm w-full min-w-[8rem]"
                  :aria-label="`Speak as for ${word}`"
                />
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-neutral btn-sm whitespace-nowrap"
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
      <div class="mb-2">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!selectedList?.words?.length"
          @click="copySpeakAsArray"
        >
          {{ copyFeedback ? 'Copied!' : 'Copy speakAs array' }}
        </button>
      </div>
      <p class="m-0 text-sm text-base-content/70">Copy this and send to update the list.</p>
    </template>
  </div>
</template>
