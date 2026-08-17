const STORAGE_KEY = 'list-and-lys:scores:v1'
const MAX_ENTRIES_PER_LIST = 20

export function listKeyFor(group) {
  return `${group?.date ?? ''}|${group?.title ?? ''}`
}

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // localStorage unavailable or full — attempt is simply not persisted
  }
}

export function getHistory(key) {
  const all = readAll()
  return Array.isArray(all[key]) ? all[key] : []
}

export function addAttempt(key, { score, total }) {
  const all = readAll()
  const existing = Array.isArray(all[key]) ? all[key] : []
  all[key] = [...existing, { ts: Date.now(), score, total }].slice(-MAX_ENTRIES_PER_LIST)
  writeAll(all)
}
