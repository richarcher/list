<script setup>
defineProps({
  groups: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
  showHelperLink: { type: Boolean, default: false }
})
defineEmits(['select', 'start', 'openHelper'])
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <h1 class="m-0 text-3xl text-base-content">Spelling Quiz</h1>
    <p class="m-0 text-base-content/70">Choose a list to practise your words</p>
    <label for="wordlist-select" class="sr-only">Choose word list</label>
    <select
      id="wordlist-select"
      :value="selectedIndex"
      class="select select-bordered select-lg min-w-[14rem] text-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      aria-describedby="select-desc"
      @change="$emit('select', Number(($event.target).value))"
    >
      <option
        v-for="(group, i) in groups"
        :key="i"
        :value="i"
      >
        {{ group.title }}
      </option>
    </select>
    <p id="select-desc" class="m-0 text-sm text-base-content/70">{{ groups[selectedIndex]?.words?.length ?? 0 }} words in this list.</p>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="groups.length === 0 || !groups[selectedIndex]?.words?.length"
      @click="$emit('start')"
    >
      Start quiz
    </button>
    <p v-if="showHelperLink" class="mt-4 mb-0">
      <button type="button" class="btn btn-ghost btn-sm link link-hover text-base-content/70" @click="$emit('openHelper')">
        Parent: TTS helper
      </button>
    </p>
  </div>
</template>
