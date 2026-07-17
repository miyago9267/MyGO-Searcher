export function leven_distance(s1: string, s2: string): number {
  let previous = Array.from({ length: s2.length + 1 }, (_, index) => index)

  for (let i = 1; i <= s1.length; i++) {
    const current = [i]

    for (let j = 1; j <= s2.length; j++) {
      const substitutionCost = s1[i - 1] === s2[j - 1] ? 0 : 1
      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + substitutionCost,
      )
    }

    previous = current
  }

  return previous[s2.length] ?? s1.length
}
