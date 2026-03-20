import { ref, computed } from 'vue'

export function useWordlists() {
  const wordlists = ref([])
  const selectedIndex = ref(0)

  const groups = computed(() => {
    const list = Array.isArray(wordlists.value) ? wordlists.value : []
    return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  })

  const selectedGroup = computed(() => groups.value[selectedIndex.value] ?? null)
  const selectedLang = computed(() => selectedGroup.value?.lang ?? 'en')

  function loadWordlists() {
    fetch('/wordlists.json')
      .then((r) => r.json())
      .then((data) => {
        wordlists.value = Array.isArray(data) ? data : []
        if (groups.value.length && selectedIndex.value >= groups.value.length) {
          selectedIndex.value = 0
        }
      })
      .catch(() => {
        wordlists.value = []
      })
  }

  function selectList(index) {
    selectedIndex.value = Number(index)
  }

  return { groups, selectedIndex, selectedGroup, selectedLang, loadWordlists, selectList }
}
