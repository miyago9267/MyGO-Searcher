<template>
    <div class="mb-2 mx-2 flex flex-col group">
        <div class="relative">
            <img v-lazy="encodedUrl" class="w-full rounded-lg mb-2 outline outline-1 outline-tggray-300 group-hover:opacity-50 transition-opacity duration-300" />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button @click="downloadImage" class="bg-gray-700 text-white rounded-full px-4 py-2 mx-1 opacity-90">下載</button>
                <button @click="copyToClipboard" class="bg-gray-700 text-white rounded-full px-4 py-2 mx-1 opacity-90">複製</button>
            </div>
        </div>
        <span class="font-bold text-gray-100 text-center">{{ props.alt }}</span>
    </div>
</template>
<script setup lang="ts">

import { defineProps, computed } from 'vue';

interface img {
    url: string,
    alt: string
}

const props = defineProps<img>();
const encodedUrl = computed(() => props.url + '?t=' + new Date().getTime());

const downloadImage = () => {
  const link = document.createElement('a');
  link.href = props.url;
  link.download = props.alt || 'image';
  link.click();
}

const copyToClipboard = async () => {
  try {
    const response = await fetch(props.url + '?t=' + new Date().getTime(), {
      method: 'GET',
    });
    console.log(response)
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = async () => {
      const clipboardItem = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([clipboardItem]);
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('複製圖片失敗', error);
  }
}

</script>

<style scoped>
.group:hover .group-hover\:opacity-50 {
  opacity: 0.5;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>