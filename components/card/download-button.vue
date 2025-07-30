<template>
<svg @click="downloadImage" class="download-icon color-[#b6b2b2] hover:color-[#4d4d4d] mx-[10px] p-[10px] cursor-pointer"
    xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px"
    fill="currentcolor">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M5 20h14v-2H5v2zm7-18L5.33 10h3.84v4h4.67v-4h3.83L12 2z" />
</svg>
</template>

<script lang="ts" setup>

const props = defineProps<{
    url: string;
    alt?: string;
}>();

const downloadImage = () => {
    const link = document.createElement('a');
    link.href = props.url;
    link.download = props.alt || 'image';
    link.click();
}
</script>

<style scoped>
.download-icon {
    transform: rotate(180deg);
}
</style>