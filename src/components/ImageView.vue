<template>
    <div class="mb-2 mx-2 flex flex-col">
        <img :src="props.src" class="w-full rounded-lg mb-2 outline outline-1 outline-tggray-300" />
        <span class="font-bold text-gray-100 text-center">{{ altText }}</span>
    </div>
</template>
<script setup lang="ts">

import { defineProps, watch, ref } from 'vue';

const props = defineProps({
    src: String
});

const altText = ref(props.src?.match(/([^\/]+)(?=\.\w+$)/)?.[0].replace(/\.[^/.]+$/, '') || '無題');

watch(() => props.src, (newSrc) => {
    const alt = newSrc?.match(/([^\/]+)(?=\.\w+$)/)?.[0].replace(/\.[^/.]+$/, '');
    altText.value = alt || '無題';
}, { immediate: true });

</script>