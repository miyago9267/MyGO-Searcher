<template>
<div class="flex w-full justify-center relative">
    <input type="text"
    class="flex w-full h-8
    rounded-md border-solid bg-tggray-300 border-1 px-4 bg-tggray-50 text-white pr-8"
    placeholder="搜尋表情包" v-model="search" @input="handleInput">
    <div class="py-0 absolute right-3 h-full flex justify-center items-center">
      <button v-if="search" @click="clearSearch" class="p-0 text-tggray-500">✕</button>
    </div>
</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const search = ref('');
const emit = defineEmits(['update:search']);

const handleInput = () => {
  emit('update:search', search.value);
}

const clearSearch = () => {
  search.value = '';
  emit('update:search', search.value);
}

</script>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>