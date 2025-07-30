<template>
    <svg @click="copyToClipboard" class="color-[#b6b2b2] hover:color-[#4d4d4d] mx-[10px] p-[10px] cursor-pointer"
        xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px"
        fill="currentcolor">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
</template>

<script lang="ts" setup>
// import { CopyToClipboard } from '~/composables/common';
import type { ImageItem } from '~/types';

const props = defineProps<ImageItem>();

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