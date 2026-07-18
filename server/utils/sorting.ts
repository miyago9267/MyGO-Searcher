export type SortOrder = 'id' | 'random' | 'episode' | 'alphabetical' | 'popularity'

interface SortableImage {
  id?: string | number
  alt?: string
  episode?: string
  popularity?: number
}

export async function sortImages<T extends SortableImage>(allImages: T[], order: SortOrder = 'id'): Promise<T[]> {
  return new Promise((resolve) => {
    const sortedImages = allImages.sort((a, b) => {
      if (order === 'id') {
        const aId = String(a.id ?? '')
        const bId = String(b.id ?? '')
        const aNumber = Number(aId)
        const bNumber = Number(bId)

        if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
          return aNumber - bNumber
        }

        return aId.localeCompare(bId, 'en', { numeric: true })
      }
      if (order === 'random') {
        return Math.random() - 0.5
      }
      if (order === 'episode') {
        const parseEpisode = (episode: string) => {
          const match = episode.match(/^(mygo|mujica)_(\d+)$/)
          if (!match) return { series: 'zzz', number: 0 }
          return {
            series: match[1] === 'mygo' ? 'a' : 'b',
            number: Number.parseInt(match[2]!),
          }
        }
        const aParsed = parseEpisode(a.episode || '')
        const bParsed = parseEpisode(b.episode || '')
        return aParsed.series === bParsed.series
          ? aParsed.number - bParsed.number
          : aParsed.series.localeCompare(bParsed.series)
      }
      if (order === 'alphabetical') {
        return (a.alt || '').localeCompare(b.alt || '', 'zh', { numeric: true })
      }
      if (order === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0)
      }
      return 0
    })

    resolve(sortedImages)
  })
}
