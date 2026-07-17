<template>
<span class="font-bold text-gray-100 text-center">{{ props.alt }}</span>
</template>

<script lang="ts" setup>
const props = defineProps<{
    alt: string
}>();
</script>
