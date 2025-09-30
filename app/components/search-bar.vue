<template>
  <div class="flex w-full justify-center relative">
    <input
      v-model="search"
      type="text"
      class="flex w-full h-8 rounded-md border-[--border] border-solid border-1 px-4 bg-[--bg-default] text-[--font-default] pr-8"
      placeholder="搜尋表情包"
      @input="handleInput"
    >
    <div class="py-0 absolute right-3 h-full flex justify-center items-center">
      <button
        v-if="search"
        class="p-0 text-tggray-500 border-0 cursor-pointer"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const emit = defineEmits(['update:search'])

const handleInput = () => {
  emit('update:search', search.value)
}

const clearSearch = () => {
  search.value = ''
  emit('update:search', search.value)
}
</script>
