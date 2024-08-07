<template>
    <div class="mb-2 mx-2 flex flex-col group">
        <div class="relative">
            <img v-lazy="encodedUrl" class="w-full rounded-lg mb-2 outline outline-1 outline-tggray-300 group-hover:opacity-50 transition-opacity duration-300" />
            <div class="icons absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <!-- <button @click="downloadImage" class="bg-gray-700 text-white rounded-full px-4 py-2 mx-1 opacity-90">下載</button>
                <button @click="copyToClipboard" class="bg-gray-700 text-white rounded-full px-4 py-2 mx-1 opacity-90">複製</button> -->
                <svg @click="downloadImage" class="download-icon color-[#b6b2b2] hover:color-[#4d4d4d]"
                xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="currentcolor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 20h14v-2H5v2zm7-18L5.33 10h3.84v4h4.67v-4h3.83L12 2z"/>
                </svg>
                <svg @click="copyToClipboard" class="color-[#b6b2b2] hover:color-[#4d4d4d]"
                xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="currentcolor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
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
    const convertJpegToPng = async (jpegBlob: Blob) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(jpegBlob);
      });
    };
    const blob = await response.blob();
    const pngBlob = await convertJpegToPng(blob);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const clipboardItem = new ClipboardItem({ 'image/png': pngBlob as Blob });
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

.image-container {
  position: relative;
  display: inline-block;
}

.icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.icons svg {
  margin: 0 10px;
  cursor: pointer;
  /* background-color: white; */
  border-radius: 50%;
  padding: 10px;
  /* box-shadow: 0 0 5px rgba(0,0,0,0.3); */
}

.download-icon {
  transform: rotate(180deg);
}
</style>