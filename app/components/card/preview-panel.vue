<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      @click.self="close"
    >
      <div class="flex max-h-[80vh] max-w-[80vw] flex-col gap-4 rounded-lg bg-[--bg-sub] p-4 shadow-2xl">
        <img
          :src="props.imageUrl"
          :alt="props.alt"
          class="max-h-[60vh] max-w-full self-center rounded-md object-contain"
        >
        <div class="text-sm text-[--font-default] whitespace-pre-wrap leading-relaxed">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  imageUrl: string
  alt: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>
