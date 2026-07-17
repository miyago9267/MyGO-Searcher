import type { FilterOptions, ImageItem } from '~/types'

export function filterImages(images: ImageItem[], filters: FilterOptions): ImageItem[] {
  const selectedEpisodes = [
    ...(filters.MyGO集數 || []),
    ...(filters.AveMujica集數 || [])
  ]
  const selectedCharacters = filters.人物 || []

  if (!selectedEpisodes.length && !selectedCharacters.length) {
    return images
  }

  return images.filter((image) => {
    const matchesEpisode = !selectedEpisodes.length ||
      selectedEpisodes.includes(image.episode || '')
    const imageCharacters = [image.author, ...(image.tags || [])].filter(Boolean)
    const matchesCharacter = !selectedCharacters.length ||
      selectedCharacters.some(character => imageCharacters.includes(character))

    return matchesEpisode && matchesCharacter
  })
}
