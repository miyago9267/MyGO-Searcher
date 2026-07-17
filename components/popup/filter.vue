<template>
  <div
    class="filter-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="filter-title"
    @click.self="handleClose"
  >
    <section class="filter-dialog">
      <header class="filter-header">
        <div>
          <h2 id="filter-title">篩選圖片</h2>
          <p>集數可跨作品複選，人物會比對作者與標籤</p>
        </div>
        <button type="button" class="close-button" aria-label="關閉篩選器" @click="handleClose">
          <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      </header>

      <div class="filter-content">
        <article v-for="(options, category) in filters" :key="category" class="filter-group">
          <div class="group-heading">
            <div>
              <h3>{{ category }}</h3>
              <p>{{ categoryDescriptions[String(category)] }}</p>
            </div>
            <button
              v-if="selectedCount(String(category))"
              type="button"
              class="clear-category"
              @click="clearCategory(String(category))"
            >
              清除
            </button>
          </div>

          <div :class="['option-grid', category === '人物' ? 'option-grid--people' : '']">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              :aria-pressed="isSelected(String(category), option.value)"
              :class="['option-chip', { 'option-chip--selected': isSelected(String(category), option.value) }]"
              @click="toggleOption(String(category), option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </article>
      </div>

      <footer class="filter-footer">
        <p><strong>{{ totalSelected }}</strong> 個條件</p>
        <div class="footer-actions">
          <button
            type="button"
            class="reset-button"
            :disabled="totalSelected === 0"
            @click="handleReset"
          >
            全部重置
          </button>
          <button type="button" class="apply-button" @click="handleClose">查看結果</button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { FilterOptions, FilterPopupProps } from '~/types/filter'

const props = defineProps<FilterPopupProps>()
const emit = defineEmits<{
  'update:selectedFilters': [filters: FilterOptions]
  close: []
}>()

const emptyFilters = (): FilterOptions => ({
  MyGO集數: [],
  AveMujica集數: [],
  人物: []
})
const cloneFilters = (filters: FilterOptions): FilterOptions => ({
  MyGO集數: [...filters.MyGO集數],
  AveMujica集數: [...filters.AveMujica集數],
  人物: [...filters.人物]
})

const categoryDescriptions: Record<string, string> = {
  MyGO集數: 'It’s MyGO!!!!!',
  AveMujica集數: 'Ave Mujica',
  人物: '作者或標籤'
}
const localSelectedFilters = ref<FilterOptions>(cloneFilters(props.selectedFilters))
const totalSelected = computed(() => Object.values(localSelectedFilters.value)
  .reduce((total, values) => total + values.length, 0))

watch(() => props.selectedFilters, (filters) => {
  localSelectedFilters.value = cloneFilters(filters)
}, { deep: true })

const selectedValues = (category: string) => localSelectedFilters.value[category] || []
const selectedCount = (category: string) => selectedValues(category).length
const isSelected = (category: string, value: string) => selectedValues(category).includes(value)
const updateFilters = () => emit('update:selectedFilters', cloneFilters(localSelectedFilters.value))

const toggleOption = (category: string, value: string) => {
  const currentValues = selectedValues(category)
  localSelectedFilters.value[category] = currentValues.includes(value)
    ? currentValues.filter(item => item !== value)
    : [...currentValues, value]
  updateFilters()
}

const clearCategory = (category: string) => {
  localSelectedFilters.value[category] = []
  updateFilters()
}

const handleReset = () => {
  localSelectedFilters.value = emptyFilters()
  updateFilters()
}

const handleClose = () => emit('close')
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') handleClose()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.filter-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(0 0 0 / 72%);
  backdrop-filter: blur(6px);
}

.filter-dialog {
  display: flex;
  width: min(720px, 100%);
  max-height: min(720px, calc(100dvh - 48px));
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #3e3e3e;
  border-radius: 20px;
  background: #252525;
  box-shadow: 0 24px 80px rgb(0 0 0 / 55%);
}

.filter-header,
.filter-footer {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
}

.filter-header {
  border-bottom: 1px solid #3a3a3a;
}

.filter-header h2 {
  margin: 0;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
}

.filter-header p,
.group-heading p,
.filter-footer p {
  margin: 4px 0 0;
  color: #929292;
  font-size: 13px;
}

.close-button,
.option-chip,
.clear-category,
.reset-button,
.apply-button {
  margin: 0;
  border: 0;
  outline: 0;
  font-family: inherit;
}

.close-button {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  padding: 0;
  border: 1px solid #454545;
  border-radius: 50%;
  background: #1d1d1d;
  color: #aaa;
}

.close-icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.close-button:hover {
  border-color: #666;
  color: #fff;
}

.filter-content {
  display: grid;
  gap: 10px;
  min-height: 0;
  padding: 14px 18px;
  overflow-y: auto;
}

.filter-group {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 14px;
  border: 1px solid #363636;
  border-radius: 14px;
  background: #202020;
}

.group-heading {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.group-heading h3 {
  margin: 0;
  color: #f5f5f5;
  font-size: 15px;
  font-weight: 750;
  line-height: 1.25;
}

.clear-category {
  padding: 0;
  background: transparent;
  color: #67e8f9;
  font-size: 12px;
  font-weight: 700;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(34px, 1fr));
  gap: 7px;
}

.option-grid--people {
  grid-template-columns: repeat(5, minmax(56px, 1fr));
}

.option-chip {
  min-width: 0;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #454545;
  border-radius: 9px;
  background: #292929;
  color: #aaa;
  font-size: 13px;
  font-weight: 700;
  line-height: 32px;
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.option-chip:hover {
  border-color: #707070;
  color: #fff;
}

.option-chip--selected {
  border-color: #22d3ee;
  background: #22d3ee;
  color: #102023;
}

.filter-footer {
  border-top: 1px solid #3a3a3a;
  background: #222;
}

.filter-footer p {
  margin: 0;
}

.filter-footer strong {
  color: #fff;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.reset-button,
.apply-button {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
}

.reset-button {
  background: transparent;
  color: #aaa;
}

.reset-button:hover:not(:disabled) {
  background: #303030;
  color: #fff;
}

.reset-button:disabled {
  cursor: default;
  opacity: .35;
}

.apply-button {
  background: #f5f5f5;
  color: #202020;
}

.apply-button:hover {
  background: #cffafe;
}

@media (max-width: 640px) {
  .filter-overlay {
    place-items: end center;
    padding: 0;
  }

  .filter-dialog {
    width: 100%;
    max-height: 88dvh;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 18px 18px 0 0;
  }

  .filter-header,
  .filter-footer {
    padding: 16px;
  }

  .filter-header p {
    display: none;
  }

  .filter-content {
    padding: 12px;
  }

  .filter-group {
    display: block;
    padding: 13px;
  }

  .group-heading {
    margin-bottom: 12px;
  }

  .option-grid {
    grid-template-columns: repeat(7, minmax(30px, 1fr));
    gap: 6px;
  }

  .option-grid--people {
    grid-template-columns: repeat(5, minmax(48px, 1fr));
  }

  .option-chip {
    height: 32px;
    padding: 0 4px;
    line-height: 30px;
  }

  .filter-footer {
    position: sticky;
    bottom: 0;
  }

  .filter-footer p {
    white-space: nowrap;
  }
}
</style>
