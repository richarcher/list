<script setup>
defineProps({
  groups: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
  showHelperLink: { type: Boolean, default: false }
})
defineEmits(['select', 'start', 'openHelper'])
</script>

<template>
  <div class="list-picker">
    <h1>Spelling Quiz</h1>
    <p class="subtitle">Choose a list to practise your words</p>
    <label for="wordlist-select" class="sr-only">Choose word list</label>
    <select
      id="wordlist-select"
      :value="selectedIndex"
      class="list-select"
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
    <p id="select-desc" class="hint">{{ groups[selectedIndex]?.words?.length ?? 0 }} words in this list.</p>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="groups.length === 0 || !groups[selectedIndex]?.words?.length"
      @click="$emit('start')"
    >
      Start quiz
    </button>
    <p v-if="showHelperLink" class="helper-link-wrap">
      <button type="button" class="btn-link" @click="$emit('openHelper')">
        Parent: TTS helper
      </button>
    </p>
  </div>
</template>

<style scoped>
.list-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}
h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text-h, #08060d);
}
.subtitle {
  margin: 0;
  color: var(--text, #6b6375);
}
.list-select {
  font-size: 1.25rem;
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 2px solid var(--border, #e5e4e7);
  border-radius: 8px;
  min-width: 14rem;
  background-color: var(--bg, #fff);
  color: var(--text-h, #08060d);
  cursor: pointer;
}
.list-select:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
.hint {
  font-size: 0.9rem;
  color: var(--text, #6b6375);
  margin: 0;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.helper-link-wrap {
  margin: 1rem 0 0;
}
.btn-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  color: var(--text, #6b6375);
  text-decoration: underline;
  cursor: pointer;
}
.btn-link:hover {
  color: var(--text-h, #08060d);
}
.btn-link:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
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
