<template>
  <div class="relative flex justify-end">
    <button 
      @click="toggleSort" 
      data-sort-button
      class="p-2 bg-tggray-50 border-tggray-50 text-white rounded-full flex items-center gap-2"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-white"
      >
        <path
          d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6Z"
          fill="currentColor"
        />
        <path
          d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
          fill="currentColor"
        />
        <path
          d="M9 18C9 17.4477 9.44772 17 10 17H14C14.5523 17 15 17.4477 15 18C15 18.5523 14.5523 19 14 19H10C9.44772 19 9 18.5523 9 18Z"
          fill="currentColor"
        />
        <path
          d="M16 9L18 7M18 7L20 9M18 7V21"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      排序
    </button>
    
    <!-- 使用抽離的排序彈出視窗 -->
    <popup-sort
      :show="showSort"
      v-model="selectedSort"
      @close="handleSortClose"
      @update:model-value="handleSortUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Emits 定義
const emit = defineEmits<{
  'update:sort': [sortValue: string]
}>()

// 響應式數據
const showSort = ref(false)
const selectedSort = ref('id')

// 方法
const toggleSort = () => {
  showSort.value = !showSort.value
}

const handleSortUpdate = (value: string) => {
  selectedSort.value = value
  emit('update:sort', value)
}

const handleSortClose = () => {
  showSort.value = false
}
</script>