<template>
  <div class="relative flex justify-end">
    <button
      class="p-2 bg-[--bg-default] border-[--border] dark:border-[--bg-default] text-[--font-default] rounded-full flex items-center gap-2"
      @click="toggleFilter"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-[--font-default]"
      >
        <path
          d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H4C3.44772 5 3 4.55228 3 4Z"
          fill="currentColor"
        />
        <path
          d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
          fill="currentColor"
        />
        <path
          d="M9 20C9 19.4477 9.44772 19 10 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H10C9.44772 21 9 20.5523 9 20Z"
          fill="currentColor"
        />
      </svg>
      篩選器
    </button>

    <!-- 使用抽離的篩選器彈出視窗 -->
    <PopupFilter
      v-if="showFilter"
      :filters="filters"
      :selected-filters="selectedFilters"
      @update:selected-filters="handleFilterUpdate"
      @close="handleFilterClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FilterCategoryKey, createEmptyFilters } from '~/types'
import type { FilterCategory, FilterOptions } from '~/types'

// Emits 定義
const emit = defineEmits<{
  'update:filter': [filters: FilterOptions]
}>()

// 響應式數據
const showFilter = ref(false)

// 篩選器配置
const filters = ref<FilterCategory>({
  [FilterCategoryKey.MyGOEpisodes]: [
    { label: '1', value: 'mygo_1' },
    { label: '2', value: 'mygo_2' },
    { label: '3', value: 'mygo_3' },
    { label: '4', value: 'mygo_4' },
    { label: '5', value: 'mygo_5' },
    { label: '6', value: 'mygo_6' },
    { label: '7', value: 'mygo_7' },
    { label: '8', value: 'mygo_8' },
    { label: '9', value: 'mygo_9' },
    { label: '10', value: 'mygo_10' },
    { label: '11', value: 'mygo_11' },
    { label: '12', value: 'mygo_12' },
    { label: '13', value: 'mygo_13' },
  ],
  [FilterCategoryKey.AveMujicaEpisodes]: [
    { label: '1', value: 'mujica_1' },
    { label: '2', value: 'mujica_2' },
    { label: '3', value: 'mujica_3' },
    { label: '4', value: 'mujica_4' },
    { label: '5', value: 'mujica_5' },
    { label: '6', value: 'mujica_6' },
    { label: '7', value: 'mujica_7' },
    { label: '8', value: 'mujica_8' },
    { label: '9', value: 'mujica_9' },
    { label: '10', value: 'mujica_10' },
    { label: '11', value: 'mujica_11' },
    { label: '12', value: 'mujica_12' },
    { label: '13', value: 'mujica_13' },
  ],
  [FilterCategoryKey.Characters]: [
    { label: '燈', value: '燈' },
    { label: '愛音', value: '愛音' },
    { label: '立希', value: '立希' },
    { label: '爽世', value: '爽世' },
    { label: '樂奈', value: '樂奈' },
    { label: '初華', value: '初華' },
    { label: '海鈴', value: '海鈴' },
    { label: '祥子', value: '祥子' },
    { label: '睦', value: '睦' },
    { label: '喵夢', value: '喵夢' },
  ],
})

// 選中的篩選器
const selectedFilters = ref<FilterOptions>(createEmptyFilters())

// 方法
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const handleFilterUpdate = (newFilters: FilterOptions) => {
  const normalizedFilters = { ...createEmptyFilters(), ...newFilters }

  selectedFilters.value = normalizedFilters
  // 直接發送更新給父組件，實現即時篩選
  emit('update:filter', normalizedFilters)
}

const handleFilterClose = () => {
  showFilter.value = false
}
</script>
