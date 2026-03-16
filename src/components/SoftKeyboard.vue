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
  <div class="w-full max-w-[28rem] mx-auto py-2 flex flex-col gap-1.5 [touch-action:manipulation]" role="group" aria-label="Keyboard">
    <div class="flex justify-center gap-1 flex-nowrap">
      <button
        v-for="char in ROW1"
        :key="char"
        type="button"
        class="btn btn-sm min-w-7 min-h-11 flex-1 max-w-10 text-base select-none"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="flex justify-center gap-1 flex-nowrap">
      <button
        v-for="char in ROW2"
        :key="char"
        type="button"
        class="btn btn-sm min-w-7 min-h-11 flex-1 max-w-10 text-base select-none"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="flex justify-center gap-1 flex-nowrap">
      <button
        v-for="char in ROW3"
        :key="char"
        type="button"
        class="btn btn-sm min-w-7 min-h-11 flex-1 max-w-10 text-base select-none"
        :aria-label="char"
        :disabled="disabled"
        @click="emit('key', char)"
      >
        {{ char }}
      </button>
    </div>
    <div class="flex justify-center gap-2 flex-nowrap mt-1">
      <button
        type="button"
        class="btn btn-sm btn-neutral flex-none max-w-14 min-h-11 text-lg"
        aria-label="Backspace"
        :disabled="disabled"
        @click="emit('key', 'backspace')"
      >
        ←
      </button>
      <button
        type="button"
        class="btn btn-sm btn-neutral flex-none max-w-10 min-h-11"
        aria-label="Hyphen"
        :disabled="disabled"
        @click="emit('key', '-')"
      >
        -
      </button>
      <button
        type="button"
        class="btn btn-sm btn-neutral flex-[4] max-w-40 min-w-16 min-h-11"
        aria-label="Space"
        :disabled="disabled"
        @click="emit('key', ' ')"
      >
        space
      </button>
    </div>
  </div>
</template>
