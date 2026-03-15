<script setup>
defineProps({
  disabled: { type: Boolean, default: false }
})

const ROW1 = 'qwertyuiop'.split('')
const ROW2 = 'asdfghjkl'.split('')
const ROW3 = 'zxcvbnm'.split('')

const emit = defineEmits(['key'])
</script>

<template>
  <div class="soft-keyboard" role="group" aria-label="Keyboard">
    <div class="keyboard-row">
      <button
        v-for="char in ROW1"
        :key="char"
        type="button"
        class="key"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="keyboard-row">
      <button
        v-for="char in ROW2"
        :key="char"
        type="button"
        class="key"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="keyboard-row">
      <button
        v-for="char in ROW3"
        :key="char"
        type="button"
        class="key"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="keyboard-row keyboard-row-bottom">
      <button
        type="button"
        class="key key-backspace"
        aria-label="Backspace"
        :disabled="disabled"
        @click="emit('key', 'backspace')"
      >
        ←
      </button>
      <button
        type="button"
        class="key key-hyphen"
        aria-label="Hyphen"
        :disabled="disabled"
        @click="emit('key', '-')"
      >
        -
      </button>
      <button
        type="button"
        class="key key-space"
        aria-label="Space"
        :disabled="disabled"
        @click="emit('key', ' ')"
      >
        space
      </button>
    </div>
  </div>
</template>

<style scoped>
.soft-keyboard {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  touch-action: manipulation;
}
.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: nowrap;
}
.keyboard-row-bottom {
  margin-top: 0.25rem;
  gap: 0.5rem;
}
.key {
  min-width: 1.75rem;
  min-height: 2.75rem;
  padding: 0.35rem 0.5rem;
  font-size: 1rem;
  font-family: var(--sans, system-ui, sans-serif);
  color: var(--text-h, #08060d);
  background: var(--code-bg, #f4f3ec);
  border: 2px solid var(--border, #e5e4e7);
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  max-width: 2.5rem;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.key:active {
  background: var(--border, #e5e4e7);
}
.key:focus-visible {
  outline: 2px solid var(--accent, #aa3bff);
  outline-offset: 2px;
}
.key:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.key-space {
  flex: 4;
  max-width: 10rem;
  min-width: 4rem;
}
.key-backspace {
  flex: 0 0 auto;
  max-width: 3.5rem;
  font-size: 1.1rem;
}
.key-hyphen {
  flex: 0 0 auto;
  max-width: 2.5rem;
}
</style>
