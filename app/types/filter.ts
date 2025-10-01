export interface FilterOption {
  label: string
  value: string
}

export enum FilterCategoryKey {
  MyGOEpisodes = 'MyGO集數',
  AveMujicaEpisodes = 'AveMujica集數',
  Characters = '人物',
}

export type FilterCategory = Partial<Record<FilterCategoryKey, FilterOption[]>>

export type FilterOptions = Partial<Record<FilterCategoryKey, string[]>>

export const createEmptyFilters = (): FilterOptions => ({
  [FilterCategoryKey.MyGOEpisodes]: [],
  [FilterCategoryKey.AveMujicaEpisodes]: [],
  [FilterCategoryKey.Characters]: [],
})

export interface FilterPopupProps {
  filters: FilterCategory
  selectedFilters: FilterOptions
}
