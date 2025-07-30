<template>
<span class="font-bold text-gray-100 text-center">{{ props.alt }}</span>
</template>

<script lang="ts" setup>
import type { ImageItem } from '~/types';

const props = defineProps<ImageItem>();
</script>