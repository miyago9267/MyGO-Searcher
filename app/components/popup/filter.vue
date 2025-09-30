<template>
  <div
    class="fixed inset-0 flex items-center justify-center rounded-xl bg-opacity-50 z-50 bg-black/80 backdrop-blur-2"
    @click.self="handleClose"
  >
    <div class="bg-[--bg-sub] border rounded-lg border-tggray-300 shadow-lg p-6 w-120 relative">
      <!-- 關閉按鈕 -->
      <button
        class="absolute top-4 right-4 bg-transparent border-none text-6 text-[#b0b0b0] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-2 transition-all duration-200 hover:bg-[#404040] hover:text-white leading-none"
        @click="handleClose"
      >
        ×
      </button>

      <!-- 篩選器內容 -->
      <div class="flex justify-around">
        <div
          v-for="(options, category) in filters"
          :key="category"
          class="border-b border-gray-300 pb-8"
        >
          <h3 class="mb-2 text-lg font-bold">
            {{ category === '人物' ? category + ' (WIP)' : category }}
          </h3>
          <div class="h-px bg-gray-300 mb-3" />
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
                class="sr-only"
                @change="(event) => handleFilterChange(String(category), option.value, event)"
              >
              <label
                :for="`${category}-${option.value}`"
                :class="[
                  'text-sm cursor-pointer select-none flex-1 pl-2 py-[4px] rounded-md border transition-all duration-20 font-bold',
                  localSelectedFilters[String(category)]?.includes(option.value)
                    ? 'text-white border-blue-500'
                    : 'text-gray-500 border-gray-300 hover:bg-gray-400',
                ]"
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
          class="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          @click="handleReset"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { FilterPopupProps, FilterOptions } from '~/types/filter'

// Props 和 Emits 定義
const props = defineProps<FilterPopupProps>()
const emit = defineEmits<{
  'update:selectedFilters': [filters: FilterOptions]
  'close': []
}>()

// 本地狀態管理
const localSelectedFilters = ref<FilterOptions>({ ...props.selectedFilters })

// 組件掛載時確保發送初始狀態
onMounted(() => {
  emit('update:selectedFilters', { ...localSelectedFilters.value })
})

// 監聽 props 變化
watch(
  () => props.selectedFilters,
  (newFilters) => {
    localSelectedFilters.value = { ...newFilters }
  },
  { deep: true, immediate: true },
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
  }
  else {
    localSelectedFilters.value[category] = localSelectedFilters.value[category].filter(
      item => item !== value,
    )
  }

  console.log(`篩選器更新: ${category} - ${value} (${isChecked ? '選中' : '未選中'})`)

  emit('update:selectedFilters', { ...localSelectedFilters.value })
}

// 處理重置
const handleReset = () => {
  const resetFilters: FilterOptions = {
    MyGO集數: [],
    AveMujica集數: [],
    人物: [],
  }

  localSelectedFilters.value = resetFilters
  emit('update:selectedFilters', resetFilters)
}

// 處理關閉
const handleClose = () => {
  emit('close')
}
</script>
