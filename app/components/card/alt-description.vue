<template>
  <span class="font-bold text-[--font-default] text-center">{{ props.alt }}</span>
</template>

<script lang="ts" setup>
import type { ImageItem } from '~/types'

const props = defineProps<ImageItem>()
</script>
