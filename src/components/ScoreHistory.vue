<script setup>
import { computed } from 'vue'

const props = defineProps({
  history: { type: Array, default: () => [] },
  label: { type: String, default: 'Recent scores' },
})

const recent = computed(() => [...props.history].slice(-10).reverse())

const best = computed(() => {
  if (!props.history.length) return null
  return props.history.reduce((a, b) => (b.score / b.total > a.score / a.total ? b : a))
})

function formatDateTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<template>
  <div v-if="history.length" class="w-full flex flex-col items-center gap-2">
    <p class="m-0 text-sm font-medium text-base-content/80">{{ label }}</p>
    <div
      v-if="best"
      class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30"
    >
      <span class="text-xs font-semibold text-primary uppercase tracking-wide">Best</span>
      <span class="text-xs text-base-content/60">{{ formatDateTime(best.ts) }}</span>
      <span class="text-sm font-semibold text-base-content">{{ best.score }}/{{ best.total }}</span>
    </div>
    <ul class="list-none p-0 m-0 w-full flex flex-col">
      <li
        v-for="(attempt, i) in recent"
        :key="i"
        class="flex items-center justify-between gap-3 px-3 py-2 border-b border-base-300 last:border-b-0 text-sm"
      >
        <span class="text-base-content/60">{{ formatDateTime(attempt.ts) }}</span>
        <span class="font-medium text-base-content">{{ attempt.score }}/{{ attempt.total }}</span>
      </li>
    </ul>
  </div>
</template>
