<script setup>
defineProps({
  groups: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
  megaEnAvailable: { type: Boolean, default: false },
  megaAfAvailable: { type: Boolean, default: false },
})
defineEmits(['select', 'start', 'mega-start'])
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8 max-w-md w-full">
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

    <div class="w-full border-t border-base-300 pt-6 mt-2 flex flex-col items-center gap-3">
      <p class="m-0 text-sm font-medium text-base-content/80">Mega (up to 10 random words)</p>
      <p class="m-0 text-xs text-base-content/60 text-center">
        One language per run — English or Afrikaans. No replay. Timer runs from the start.
      </p>
      <div class="flex flex-col sm:flex-row gap-2 w-full justify-center">
        <button
          type="button"
          class="btn btn-outline btn-primary flex-1 sm:flex-initial min-w-[10rem]"
          :disabled="!megaEnAvailable"
          @click="$emit('mega-start', 'en')"
        >
          Mega-test
        </button>
        <button
          type="button"
          class="btn btn-outline btn-primary flex-1 sm:flex-initial min-w-[10rem]"
          :disabled="!megaAfAvailable"
          @click="$emit('mega-start', 'af')"
        >
          Mega-toets
        </button>
      </div>
    </div>
  </div>
</template>
