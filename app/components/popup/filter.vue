<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md animate-fade-in"
    @click.self="handleClose"
  >
    <div class="bg-[--bg-popup-color] border border-[--border] rounded-2xl shadow-2xl p-6 max-w-[90vw] relative animate-scale-in">
      <!-- 關閉按鈕 -->
      <button
        class="absolute top-4 right-4 bg-transparent border-none text-xl text-[--font-gray] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-[--bg-hover] hover:text-[--font-default] hover:rotate-90 leading-none"
        @click="handleClose"
      >
        ×
      </button>

      <!-- 標題 -->
      <h2 class="text-xl font-bold text-[--font-default] mb-5 pr-10">
        篩選選項
      </h2>

      <!-- 篩選器內容 - 橫向併排 -->
      <div class="flex gap-6">
        <div
          v-for="[categoryKey, options] in filterEntries"
          :key="categoryKey"
          class="flex-1 min-w-[140px]"
        >
          <h3 class="mb-3 text-sm font-bold text-[--font-default] flex items-center gap-2">
            <span class="w-0.5 h-4 bg-[--brand] rounded-full" />
            {{ categoryKey === FilterCategoryKey.Characters ? `${categoryKey} (WIP)` : categoryKey }}
          </h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="option in options"
              :key="option.value"
              class="flex items-center"
            >
              <input
                :id="`${categoryKey}-${option.value}`"
                type="checkbox"
                :value="option.value"
                :checked="localSelectedFilters?.[categoryKey]?.includes(option.value)"
                class="sr-only peer"
                @change="handleFilterChange(categoryKey, option.value, $event)"
              >
              <label
                :for="`${categoryKey}-${option.value}`"
                class="text-xs cursor-pointer select-none w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-center peer-checked:bg-[--brand] peer-checked:border-[--brand] peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-[--brand]/30 hover:border-[--brand] hover:bg-[--bg-hover] border-[--outline] text-[--font-default]"
              >
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-3 mt-5 pt-5 border-t border-[--outline]">
        <button
          class="flex-1 px-5 py-2.5 bg-[--bg-sub] text-[--font-default] rounded-lg text-sm font-medium hover:bg-[--bg-hover] transition-all duration-200 border border-[--border] hover:border-[--brand]"
          @click="handleReset"
        >
          重置篩選
        </button>
        <button
          class="flex-1 px-5 py-2.5 bg-[--brand] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-md shadow-[--brand]/30"
          @click="handleClose"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRef, watch } from 'vue'
import type { FilterOption, FilterPopupProps, FilterOptions } from '~/types'
import { FilterCategoryKey, createEmptyFilters } from '~/types'

// Props 和 Emits 定義
const props = defineProps<FilterPopupProps>()
const emit = defineEmits<{
  'update:selectedFilters': [filters: FilterOptions]
  'close': []
}>()

const filtersProp = toRef(props, 'filters')
const filterEntries = computed(() => Object.entries(filtersProp.value ?? {}) as Array<[FilterCategoryKey, FilterOption[]]>)

// 本地狀態管理
const localSelectedFilters = ref<FilterOptions>({ ...createEmptyFilters(), ...props.selectedFilters })

// 組件掛載時確保發送初始狀態
onMounted(() => {
  emit('update:selectedFilters', { ...localSelectedFilters.value })
})

// 監聽 props 變化
watch(
  () => props.selectedFilters,
  (newFilters) => {
    localSelectedFilters.value = { ...createEmptyFilters(), ...newFilters }
  },
  { deep: true, immediate: true },
)

// 處理篩選器變化
const handleFilterChange = (category: FilterCategoryKey, value: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const isChecked = target.checked

  const currentValues = localSelectedFilters.value[category] ?? []

  if (isChecked) {
    if (!currentValues.includes(value)) {
      localSelectedFilters.value[category] = [...currentValues, value]
    }
  }
  else {
    localSelectedFilters.value[category] = currentValues.filter(item => item !== value)
  }

  emit('update:selectedFilters', { ...localSelectedFilters.value })
}

// 處理重置
const handleReset = () => {
  const resetFilters = createEmptyFilters()

  localSelectedFilters.value = { ...resetFilters }
  emit('update:selectedFilters', { ...resetFilters })
}

// 處理關閉
const handleClose = () => {
  emit('close')
}
</script>
