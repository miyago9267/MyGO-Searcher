<template>
  <div class="relative flex justify-end">
    <button 
      @click="toggleFilter" 
      class="p-2 bg-tggray-50 border-tggray-50 text-white rounded"
    >
      篩選
    </button>
    
    <!-- 使用抽離的篩選器彈出視窗 -->
    <PopupFilter
      v-if="showFilter"
      :filters="filters"
      :selected-filters="selectedFilters"
      @update:selected-filters="handleFilterUpdate"
      @apply="handleFilterApply"
      @close="handleFilterClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FilterCategory, FilterOptions } from '~/types/filter'

// Emits 定義
const emit = defineEmits<{
  'update:filter': [filters: FilterOptions]
}>()

// 響應式數據
const showFilter = ref(false)

// 篩選器配置
const filters = ref<FilterCategory>({
  MyGO集數: [
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
  AveMujica集數: [
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
  人物: [
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
  ]
})

// 選中的篩選器
const selectedFilters = ref<FilterOptions>({
  MyGO集數: [],
  AveMujica集數: [],
  人物: [],
})

// 方法
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const handleFilterUpdate = (newFilters: FilterOptions) => {
  selectedFilters.value = newFilters
}

const handleFilterApply = (appliedFilters: FilterOptions) => {
  emit('update:filter', appliedFilters)
  showFilter.value = false
}

const handleFilterClose = () => {
  showFilter.value = false
}
</script>
