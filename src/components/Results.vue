<script setup>
import { onMounted } from 'vue'
import { characterDiff } from '../lib/diff'
import { runConfetti } from '../lib/confetti'
import { playFanfare } from '../lib/sounds'

const props = defineProps({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  wrongWords: { type: Array, default: () => [] }
})
defineEmits(['tryAgain', 'pickAnotherDate'])

function getDiff(correct, userSpelling) {
  return characterDiff(correct, userSpelling ?? '')
}

onMounted(() => {
  if (props.total > 0 && props.score === props.total) {
    runConfetti()
    playFanfare()
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-8 max-w-[32rem] mx-auto">
    <h1 class="m-0 text-3xl text-base-content">Well done!</h1>
    <p v-if="total > 0 && score === total" class="m-0 text-2xl font-semibold text-success" role="status">
      Full marks!
    </p>
    <p class="m-0 text-xl text-base-content/70" aria-live="polite">
      You got <strong class="text-base-content">{{ score }}</strong> out of <strong class="text-base-content">{{ total }}</strong> correct.
    </p>
    <section v-if="wrongWords.length" class="w-full text-left" aria-labelledby="wrong-heading">
      <h2 id="wrong-heading" class="m-0 mb-2 text-xl text-base-content">Words to practise</h2>
      <p class="m-0 mb-4 text-sm text-base-content/70">Here’s the difference between what you wrote and the correct spelling.</p>
      <ul class="list-none p-0 m-0">
        <li
          v-for="(item, i) in wrongWords"
          :key="i"
          class="py-3 border-b border-base-300 last:border-b-0"
        >
          <div class="flex gap-2 items-baseline mb-1">
            <span class="flex-shrink-0 text-sm text-base-content/70 min-w-[5.5rem]">You wrote:</span>
            <span class="font-mono text-base tracking-wide">
              <template v-for="(seg, j) in getDiff(item.word, item.userSpelling).userSegments" :key="j">
                <span v-if="seg.type === 'same'" class="diff-same">{{ seg.char }}</span>
                <span v-else-if="seg.type === 'remove'" class="diff-wrong">{{ seg.char || '·' }}</span>
              </template>
            </span>
          </div>
          <div class="flex gap-2 items-baseline mb-1">
            <span class="flex-shrink-0 text-sm text-base-content/70 min-w-[5.5rem]">Correct:</span>
            <span class="font-mono text-base tracking-wide">
              <template v-for="(seg, j) in getDiff(item.word, item.userSpelling).correctSegments" :key="j">
                <span v-if="seg.type === 'same'" class="diff-same">{{ seg.char }}</span>
                <span v-else-if="seg.type === 'add'" class="diff-missing">{{ seg.char || '·' }}</span>
              </template>
              <span
                v-if="item.translation && item.translation !== item.word"
                class="translation-inline text-base-content/70 font-sans font-normal"
              >
                ({{ item.translation }})
              </span>
            </span>
          </div>
          <div
            v-if="item.translation && item.translation !== item.word"
            class="flex gap-2 items-baseline mt-0.5"
          >
            <span class="flex-shrink-0 text-sm text-base-content/70 min-w-[5.5rem]">In English:</span>
            <span class="text-sm text-base-content">{{ item.translation }}</span>
          </div>
        </li>
      </ul>
    </section>
    <div class="flex gap-3 flex-wrap justify-center">
      <button type="button" class="btn btn-neutral" @click="$emit('tryAgain')">
        Try again
      </button>
      <button type="button" class="btn btn-primary" @click="$emit('pickAnotherDate')">
        Pick another list
      </button>
    </div>
  </div>
</template>

<style scoped>
.diff-same {
  @apply text-base-content;
}
.diff-wrong {
  @apply text-error underline;
  text-decoration-style: wavy;
}
.diff-missing {
  @apply text-success font-semibold;
}
</style>
