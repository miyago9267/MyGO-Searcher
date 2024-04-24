<template>
<div class="flex w-full justify-center">
    <input type="text"
    class="flex w-full h-8
    rounded-md border-solid bg-tggray-300 border-1 px-4 bg-tggray-50 text-white"
    placeholder="搜尋表情包" v-model="search" @input="handleInput">
</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const search = ref('');
const emit = defineEmits(['update:search']);

const handleInput = () => {
  emit('update:search', search.value);
}

</script>