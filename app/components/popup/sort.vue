<template>
  <!-- 全屏背景層，用於捕獲外部點擊 -->
  <div
    v-if="show"
    class="fixed inset-0 z-40"
    @click="handleOutsideClick"
  />

  <!-- 彈出框內容 -->
  <div
    v-if="show"
    class="absolute top-full right-0 mt-2 w-48 bg-[--bg-sub] rounded-xl shadow-lg border z-50"
    @click.stop
  >
    <div class="p-4">
      <h3 class="text-lg font-medium border-gray-300 m-2">
        排序方式
      </h3>
      <div class="space-y-2">
        <label
          v-for="option in sortOptions"
          :key="option.value"
          class="flex items-center cursor-pointer hover:bg-gray-500 p-2 rounded"
        >
          <input
            v-model="selectedSort"
            type="radio"
            :value="option.value"
            class="mr-3 text-blue-600"
            @change="handleSortChange"
          >
          <span class="border-gray-300">{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

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

// 排序選項
const sortOptions = ref([
  { label: '預設排序', value: 'id' },
  { label: '隨機排序', value: 'random' },
  { label: '按集數排序', value: 'episode' },
  { label: '按字典序排序', value: 'alphabetical' },
  // { label: '按人氣排序', value: 'popularity' },
])

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
