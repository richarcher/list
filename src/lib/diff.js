/**
 * Compute character-level diff segments for displaying spelling differences.
 * Returns arrays of { type: 'same'|'add'|'remove', char } for correct and user strings.
 * "same" = matching; "add" = in correct but not user (missing); "remove" = in user but not correct (extra).
 */
export function characterDiff(correct, user) {
  const c = String(correct).toLowerCase()
  const u = String(user ?? '').toLowerCase()
  const clen = c.length
  const ulen = u.length
  const maxLen = Math.max(clen, ulen)
  const correctSegments = []
  const userSegments = []

  let i = 0
  let j = 0
  while (i < clen || j < ulen) {
    const cc = i < clen ? c[i] : null
    const uu = j < ulen ? u[j] : null
    if (cc === uu) {
      correctSegments.push({ type: 'same', char: cc })
      userSegments.push({ type: 'same', char: uu })
      i++
      j++
    } else if (cc !== null && uu !== null) {
      correctSegments.push({ type: 'add', char: cc })
      userSegments.push({ type: 'remove', char: uu })
      i++
      j++
    } else if (cc !== null) {
      correctSegments.push({ type: 'add', char: cc })
      userSegments.push({ type: 'remove', char: ' ' })
      i++
    } else {
      correctSegments.push({ type: 'add', char: ' ' })
      userSegments.push({ type: 'remove', char: uu })
      j++
    }
  }
  return { correctSegments, userSegments }
}
