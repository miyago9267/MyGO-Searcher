export interface FilterOption {
  label: string
  value: string
}

export interface FilterCategory {
  [key: string]: FilterOption[]
}

// 使用 FilterOptions 替代 SelectedFilters 以保持一致性
export interface FilterOptions {
  MyGO集數: string[]
  AveMujica集數: string[]
  人物: string[]
}

export interface FilterPopupProps {
  filters: FilterCategory
  selectedFilters: FilterOptions
}
