<template>
    <div class="mb-2 mx-2 flex flex-col group">
        <div class="relative">
            <img :src="props.url" :alt="props.alt" loading="lazy" decoding="async"
                class="w-full aspect-[334/187.88] rounded-lg mb-2 outline outline-1 outline-tggray-300 group-hover:opacity-50 transition-opacity duration-300" />
            <div
                class="absolute top-[10px] right-[10px] inset-0 flex gap-[10px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <card-download-button :id="props.id" :alt="props.alt" :url="props.url" />
                <card-copy-button :id="props.id" :alt="props.alt" :url="props.url" />
            </div>
        </div>
        <card-alt-description :alt="props.alt" :url="props.url" />
    </div>
</template>
<script setup lang="ts">
interface Props {
    id?: string | number
    url: string
    alt: string
}

const props = defineProps<Props>();

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

.icons svg {
    margin: 0 10px;
    cursor: pointer;
    border-radius: 50%;
    padding: 10px;
}
</style>
