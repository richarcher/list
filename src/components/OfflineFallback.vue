<script setup>
defineProps({
  message: { type: String, default: 'You appear to be offline. Connect to the internet to load word lists.' },
})
defineEmits(['retry'])
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 p-8 max-w-md text-center rounded-box border border-base-300 bg-base-200/50"
    role="alert"
  >
    <p class="m-0 text-lg text-base-content">No connection</p>
    <p class="m-0 text-sm text-base-content/80">{{ message }}</p>
    <button type="button" class="btn btn-primary" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>
