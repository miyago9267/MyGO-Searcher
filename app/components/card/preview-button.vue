<template>
  <svg
    class="color-[#b6b2b2] hover:color-[#4d4d4d] mx-[10px] p-[10px] cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
    height="36px"
    viewBox="0 0 24 24"
    width="36px"
    fill="currentcolor"
    @click.stop="emit('preview')"
  >
    <path
      d="M0 0h24v24H0z"
      fill="none"
    />
    <path
      d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5
         5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    />
  </svg>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  preview: []
}>()
</script>
