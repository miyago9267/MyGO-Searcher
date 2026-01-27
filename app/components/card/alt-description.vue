<template>
  <span class="font-bold text-[--font-default] text-center">
    <HighlightText :text="props.alt" :matches="props.matches" />
  </span>
</template>

<script lang="ts" setup>
import type { ImageItem } from '~/types'

const props = defineProps<ImageItem>()
</script>
