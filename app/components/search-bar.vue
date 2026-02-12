<template>
  <div class="flex w-full justify-center relative">
    <input
      v-model="search"
      type="text"
      class="flex w-full h-10 rounded-md border-[#505050] border-solid border-1 px-4 bg-[--bg-default] text-[--font-default] pr-20 focus:outline-none transition-shadow duration-200"
      :class="[
        'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
        'hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]',
        'focus:shadow-[0_4px_16px_rgba(139,92,246,0.2)]',
      ]"
      placeholder="搜尋表情包"
      @input="handleInput"
    >
    <div class="py-0 absolute right-3 h-full flex justify-center items-center gap-2">
      <button
        class="p-0 border-0 cursor-pointer flex items-center justify-center bg-transparent transition-colors duration-200"
        :class="semanticEnabled ? 'text-[--brand]' : 'text-[--font-gray]'"
        title="實驗性語義搜尋 (AI)"
        @click="handleSemanticToggle"
      >
        <span class="i-lucide-sparkles text-lg" />
      </button>

      <button
        v-if="search"
        class="p-0 text-[--font-default] border-0 cursor-pointer bg-transparent"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppToast } from '~/composables/useToast'

const props = defineProps<{
  semanticEnabled?: boolean
}>()

const search = ref('')
const emit = defineEmits(['update:search', 'update:semantic'])
const { showToast } = useAppToast()

const handleInput = () => {
  emit('update:search', search.value)
}

const clearSearch = () => {
  search.value = ''
  emit('update:search', search.value)
}

const handleSemanticToggle = () => {
  const newState = !props.semanticEnabled
  const enablePrompt = '已啟用語義搜尋功能 (實驗性功能，可能不穩定)'
  const disablePrompt = '已關閉語義搜尋功能'
  emit('update:semantic', newState)

  showToast(
    newState ? enablePrompt : disablePrompt,
    'info',
    3000,
  )
}
</script>
