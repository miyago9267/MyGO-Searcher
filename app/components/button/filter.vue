<template>
  <div class="control-wrapper">
    <ButtonControl
      label="篩選"
      :active="activeFilterCount > 0"
      :expanded="showFilter"
      :count="activeFilterCount"
      @click="toggleFilter"
    >
      <template #icon>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M7 12H17M10 18H14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </template>
    </ButtonControl>

    <Teleport to="body">
      <PopupFilter
        v-if="showFilter"
        :filters="filters"
        :selected-filters="selectedFilters"
        @update:selected-filters="handleFilterUpdate"
        @close="closeFilter"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePopup } from '~/composables/usePopup'
import { FilterCategoryKey, createEmptyFilters } from '~/types'
import type { FilterCategory, FilterOptions } from '~/types'

const emit = defineEmits<{
  'update:filter': [filters: FilterOptions]
}>()

const { isOpen: showFilter, toggle: toggleFilter, close: closeFilter } = usePopup()
const filters = ref<FilterCategory>({
  [FilterCategoryKey.MyGOEpisodes]: Array.from({ length: 13 }, (_, index) => ({
    label: String(index + 1),
    value: `mygo_${index + 1}`,
  })),
  [FilterCategoryKey.AveMujicaEpisodes]: Array.from({ length: 13 }, (_, index) => ({
    label: String(index + 1),
    value: `mujica_${index + 1}`,
  })),
  [FilterCategoryKey.Characters]: ['燈', '愛音', '立希', '爽世', '樂奈', '初華', '海鈴', '祥子', '睦', '喵夢']
    .map(character => ({ label: character, value: character })),
})
const selectedFilters = ref<FilterOptions>(createEmptyFilters())
const activeFilterCount = computed(() => Object.values(selectedFilters.value)
  .reduce((total, values) => total + (values?.length || 0), 0))

const handleFilterUpdate = (newFilters: FilterOptions) => {
  const normalizedFilters = { ...createEmptyFilters(), ...newFilters }
  selectedFilters.value = normalizedFilters
  emit('update:filter', normalizedFilters)
}
</script>

<style scoped>
.control-wrapper {
  position: relative;
}
</style>
