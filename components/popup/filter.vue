<template>
  <div 
    class="fixed inset-0 flex items-center justify-center bg-tggray-100 rounded-xl bg-opacity-50 z-50" 
    @click.self="handleClose"
  >
    <div class="bg-tggray-100 border bg-tggray-50 shadow p-6 w-120 relative">
      <!-- 關閉按鈕 -->
      <button 
        @click="handleClose" 
        class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center text-lg font-bold bg-tggray-100 rounded-md"
      > 
        × 
      </button>
      
      <!-- 篩選器內容 -->
      <div class="space-x-4 flex justify-around">
        <div 
          v-for="(options, category) in filters" 
          :key="category" 
          class="border-b border-gray-300 pb-4"
        >
          <h3 class="mb-2 text-lg font-bold">{{ category }}</h3>
          <div class="grid grid-cols-1 gap-2">
            <div 
              v-for="option in options" 
              :key="option.value" 
              class="flex items-center"
            >
              <input 
                :id="`${category}-${option.value}`"
                type="checkbox" 
                :value="option.value"
                :checked="localSelectedFilters[String(category)]?.includes(option.value)"
                @change="(event) => handleFilterChange(String(category), option.value, event)"
                class="mr-2" 
              />
              <label 
                :for="`${category}-${option.value}`" 
                class="text-sm"
              >
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 操作按鈕 -->
      <div class="flex gap-2 mt-4">
        <button 
          @click="handleApply" 
          class="flex-1 p-2 bg-tggray-100 text-white rounded hover:bg-tggray-200 transition-colors"
        >
          應用篩選
        </button>
        <button 
          @click="handleReset" 
          class="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { FilterPopupProps, FilterOptions } from '~/types/filter'

// Props 和 Emits 定義
const props = defineProps<FilterPopupProps>()
const emit = defineEmits<{
  'update:selectedFilters': [filters: FilterOptions]
  'apply': [filters: FilterOptions]
  'close': []
}>()

// 本地狀態管理
const localSelectedFilters = ref<FilterOptions>({ ...props.selectedFilters })

// 監聽 props 變化
watch(
  () => props.selectedFilters,
  (newFilters) => {
    localSelectedFilters.value = { ...newFilters }
  },
  { deep: true }
)

// 處理篩選器變化
const handleFilterChange = (category: string, value: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const isChecked = target.checked
  
  if (!localSelectedFilters.value[category]) {
    localSelectedFilters.value[category] = []
  }
  
  if (isChecked) {
    if (!localSelectedFilters.value[category].includes(value)) {
      localSelectedFilters.value[category].push(value)
    }
  } else {
    localSelectedFilters.value[category] = localSelectedFilters.value[category].filter(
      item => item !== value
    )
  }
  
  emit('update:selectedFilters', { ...localSelectedFilters.value })
}

// 處理重置
const handleReset = () => {
  const resetFilters: FilterOptions = {
    MyGO集數: [],
    AveMujica集數: [],
    人物: []
  }
  
  localSelectedFilters.value = resetFilters
  emit('update:selectedFilters', resetFilters)
}

// 處理應用篩選
const handleApply = () => {
  emit('apply', { ...localSelectedFilters.value })
}

// 處理關閉
const handleClose = () => {
  emit('close')
}
</script>