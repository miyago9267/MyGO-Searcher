<template>
    <div class="mb-2 mx-2 flex flex-col">
        <img :src="props.url" class="w-full rounded-lg mb-2 outline outline-1 outline-tggray-300" />
        <span class="font-bold text-gray-100 text-center">{{ props.alt }}</span>
    </div>
</template>
<script setup lang="ts">

import { defineProps } from 'vue';

interface img {
    url: string,
    alt: string
}

const props = defineProps<img>();

// const altText = ref(props.src?.match(/([^\/]+)(?=\.\w+$)/)?.[0].replace(/\.[^/.]+$/, '') || '無題');

// watch(() => props.url, (newSrc) => {
//     const alt = newSrc?.match(/([^\/]+)(?=\.\w+$)/)?.[0].replace(/\.[^/.]+$/, '');
//     altText.value = alt || '無題';
// }, { immediate: true });

</script>