<script setup>
import { ref, computed, watch } from 'vue'
import { shuffleArray } from '../lib/shuffle'

const props = defineProps({
  group: { type: Object, default: null },
})
defineEmits(['back'])

const order = ref([])

function reshuffle() {
  const count = props.group?.words?.length ?? 0
  order.value = shuffleArray(Array.from({ length: count }, (_, i) => i))
}

watch(() => props.group, reshuffle, { immediate: true })

const entries = computed(() => {
  const words = props.group?.words ?? []
  const lang = props.group?.lang ?? 'en'
  return order.value.map((i) => words[i]).filter(Boolean).map((w) => ({
    primary: lang === 'af' ? w.spell : w.speak,
    secondary: lang === 'af' ? w.speak : null,
  }))
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 max-w-md w-full">
    <button
      type="button"
      class="btn btn-ghost btn-sm self-start -ml-1"
      @click="$emit('back')"
    >
      ← Back to lists
    </button>
    <h1 class="m-0 text-2xl text-base-content text-center">{{ group?.title }}</h1>
    <p class="m-0 text-sm text-base-content/70">Study the list, then try the quiz when you're ready.</p>
    <button type="button" class="btn btn-outline btn-sm" @click="reshuffle">
      Shuffle
    </button>
    <ul class="list-none p-0 m-0 w-full">
      <li
        v-for="(entry, i) in entries"
        :key="i"
        class="py-3 border-b border-base-300 last:border-b-0 flex items-baseline justify-between gap-3"
      >
        <span class="text-lg text-base-content">{{ entry.primary }}</span>
        <span v-if="entry.secondary" class="text-sm text-base-content/60">{{ entry.secondary }}</span>
      </li>
    </ul>
  </div>
</template>
