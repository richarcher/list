<script setup>
defineProps({
  visible: { type: Boolean, default: false },
})
defineEmits(['reload'])
</script>

<template>
  <Transition name="pwa-prompt">
    <div
      v-if="visible"
      class="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 pointer-events-none flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        class="pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-3 max-w-lg w-full rounded-box border border-primary/30 bg-base-100/95 backdrop-blur-sm shadow-lg px-4 py-3 text-base-content"
      >
        <p class="m-0 text-sm sm:text-base flex-1">
          <strong class="text-primary">Update available</strong>
          — reload to get the latest version.
        </p>
        <button type="button" class="btn btn-primary btn-sm shrink-0" @click="$emit('reload')">
          Reload to update
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-prompt-enter-active,
.pwa-prompt-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.pwa-prompt-enter-from,
.pwa-prompt-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
