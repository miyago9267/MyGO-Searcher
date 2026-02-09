<template>
  <div>
    <div class="mb-2 mx-2 flex flex-col group">
      <div class="relative">
        <img
          :src="encodedUrl"
          loading="lazy"
          class="w-full aspect-[334/187.88] rounded-lg mb-2 outline outline-1 outline-[--outline] group-hover:opacity-50 transition-opacity duration-300"
        >
        <div
          class="absolute top-[10px] right-[10px] inset-0 flex gap-[10px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <card-preview-button
            @preview="openPreview"
          />
          <card-download-button
            :id="actionId"
            :alt="props.alt"
            :url="props.url"
          />
          <card-copy-button
            :id="actionId"
            :alt="props.alt"
            :url="props.url"
          />
        </div>
      </div>
      <card-alt-description
        :alt="props.alt"
        :url="props.url"
        :matches="props.matches"
      />
    </div>
    <card-preview-panel
      v-model="isPreviewOpen"
      :alt="props.alt"
      :image-url="encodedUrl"
    >
      {{ previewDescription }}
    </card-preview-panel>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ImageItem } from '../types'

const props = defineProps<ImageItem>()
const encodedUrl = computed(() => props.url + '?t=' + new Date().getTime())
const actionId = computed(() => {
  const { id } = props
  return id === undefined || id === null ? undefined : String(id)
})

const isPreviewOpen = ref(false)

const previewDescription = computed(() => {
  const { alt, author, episode, tags, description } = props
  const parts: string[] = []

  if (episode) {
    parts.push(`出處：${episode}`)
  }

  if (description) {
    parts.push(`介紹：${description}`)
  }

  if (author) {
    parts.push(`作者：${author}`)
  }

  if (tags?.length) {
    parts.push(`標籤：${tags.join(', ')}`)
  }

  if (!parts.length) {
    parts.push(alt)
  }

  return parts.join('\n')
})

const openPreview = () => {
  isPreviewOpen.value = true
}
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
