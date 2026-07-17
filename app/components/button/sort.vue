<template>
  <div class="control-wrapper">
    <ButtonControl
      label="排序"
      :active="selectedSort !== 'id'"
      :expanded="showSort"
      :detail="selectedSort !== 'id' ? selectedSortLabel : ''"
      @click="toggleSort"
    >
      <template #icon>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7H14M4 12H11M4 17H8M16 5V19M13 16L16 19L19 16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
    </ButtonControl>

    <PopupSort
      :show="showSort"
      :model-value="selectedSort"
      @close="closeSort"
      @update:model-value="handleSortUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePopup } from '~/composables/usePopup'

const emit = defineEmits<{
  'update:sort': [sortValue: string]
}>()

const { isOpen: showSort, toggle: toggleSort, close: closeSort } = usePopup()
const selectedSort = ref('id')
const sortLabels: Record<string, string> = {
  random: '隨機',
  episode: '集數',
  alphabetical: '字序',
  popularity: '熱門',
}
const selectedSortLabel = computed(() => sortLabels[selectedSort.value] || '')

const handleSortUpdate = (value: string) => {
  selectedSort.value = value
  emit('update:sort', value)
}
</script>

<style scoped>
.control-wrapper {
  position: relative;
}
</style>
