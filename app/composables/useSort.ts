import { ref } from 'vue'
import type { SortOption } from '~/types'

export function useSort(initialSort = 'id') {
  const selectedSort = ref(initialSort)
  
  const sortOptions = ref<SortOption[]>([
    { label: '預設排序', value: 'id' },
    { label: '隨機排序', value: 'random' },
    { label: '按集數排序', value: 'episode' },
    { label: '按字典序排序', value: 'alphabetical' },
    // { label: '按人氣排序', value: 'popularity' },
  ])

  const updateSort = (value: string) => {
    selectedSort.value = value
  }

  return {
    selectedSort,
    sortOptions,
    updateSort,
  }
}
