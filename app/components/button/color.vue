<template>
  <div class="flex flex-col relative">
    <ClientOnly v-if="!colorMode?.forced">
      <UButton
        :icon="icon"
        class="size-[32px] flex items-center justify-center p-0 border-[--border] text-[--font-default] bg-[--bg-sub] rounded-md hover:bg-[--bg-hover] transition-colors"
        :aria-label="`切換主題，目前：${label}`"
        @click="toggle"
      />
      <template #fallback>
        <div class="size-12" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const icon = computed(() => (isDark.value ? 'i-lucide-moon' : 'i-lucide-sun'))

const label = computed(() => (isDark.value ? '深色' : '淺色'))
</script>
