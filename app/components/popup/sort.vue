<template>
  <!-- 全屏背景層,用於捕獲外部點擊 -->
  <div
    v-if="show"
    class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
    @click="handleOutsideClick"
  />

  <!-- 彈出框內容 -->
  <div
    v-if="show"
    class="absolute top-full right-0 mt-3 w-56 bg-[--bg-popup-color] rounded-2xl shadow-2xl border border-[--border] z-50 overflow-hidden animate-fade-in"
    @click.stop
  >
    <div class="p-5">
      <h3 class="text-base font-bold text-[--font-default] mb-4 pb-3 border-b border-[--outline]">
        排序方式
      </h3>
      <div class="space-y-1.5">
        <label
          v-for="option in sortOptions"
          :key="option.value"
          class="flex items-center cursor-pointer hover:bg-[--bg-hover] p-3 rounded-xl transition-all duration-200 group"
        >
          <input
            v-model="selectedSort"
            type="radio"
            :value="option.value"
            class="w-4 h-4 mr-3 accent-[--brand] cursor-pointer"
            @change="handleSortChange"
          >
          <span
            class="text-sm font-medium transition-colors duration-200"
            :class="selectedSort === option.value ? 'text-[--brand]' : 'text-[--font-default] group-hover:text-[--brand]'"
          >
            {{ option.label }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useSort } from '~/composables/useSort'

// Props 定義
const props = defineProps<{
  show: boolean
  modelValue: string
}>()

// Emits 定義
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'close': []
}>()

// 響應式數據
const selectedSort = ref(props.modelValue)

// 使用 composable 獲取排序選項
const { sortOptions } = useSort()

// 方法
const handleSortChange = () => {
  emit('update:modelValue', selectedSort.value)
  emit('close')
}

const handleOutsideClick = () => {
  emit('close')
}

// 監聽 props.modelValue 變化
watch(() => props.modelValue, (newValue) => {
  selectedSort.value = newValue
})
</script>
