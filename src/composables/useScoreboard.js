import { ref, computed } from 'vue'
import { getHistory, addAttempt, listKeyFor } from '../lib/scoreboard'

export function useScoreboard(group) {
  const version = ref(0)

  const history = computed(() => {
    version.value // localStorage isn't reactive; bump this to force a re-read after a write
    const g = group.value
    return g ? getHistory(listKeyFor(g)) : []
  })

  function recordAttempt(g, score, total) {
    if (!g || total <= 0) return
    addAttempt(listKeyFor(g), { score, total })
    version.value += 1
  }

  return { history, recordAttempt }
}
