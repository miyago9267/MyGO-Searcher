<template>
  <div class="relative flex flex-wrap items-center justify-between bg-[--bg-sub] w-full h-30">
    <div class="mx-8 my-6">
      <span class="text-2xl font-bold fs-28px text-[--font-default] pb-2">MyGO表情包搜尋器</span><br>
      <span class="text-sm fs-16px text-[--font-default] pt-2">一輩子跟我一起MyGO嗎</span>
    </div>
    <div class="grow" />
    <button-color class="mx-8 my-6" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
})
</script>
