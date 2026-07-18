<template>
  <div class="flex flex-col w-screen h-full bg-[--bg-default]">
    <Header class="outline outline-offset-0 outline-[--outline] outline-2" />
    <div class="p-10">
      <div
        class="search-toolbar"
        :class="{ 'search-toolbar--focused': isSearchFocused }"
      >
        <search-bar
          class="search-toolbar__search"
          :semantic-enabled="isSemantic"
          @update:search="handleSearch"
          @update:semantic="isSemantic = $event"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
        <div class="search-toolbar__controls">
          <button-sort @update:sort="handleSort" />
          <button-filter @update:filter="handleFilter" />
        </div>
      </div>
      <main-view-panel
        class="mt-5"
        :search-query="searchQuery"
        :filter-query="filterQuery"
        :sort-order="sortOrder"
        :semantic-enabled="isSemantic"
      />
    </div>
    <Footer class="" />
    <button-top />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FilterOptions } from '~/types'
import { createEmptyFilters } from '~/types'

// 使用正確的類型定義
const searchQuery = ref<string>('')
const sortOrder = ref<string>('id')
const filterQuery = ref<FilterOptions>(createEmptyFilters())
const isSemantic = ref(false)
const isSearchFocused = ref(false)

// 處理搜尋更新
const handleSearch = (newSearch: string) => {
  searchQuery.value = newSearch
}

// 處理篩選更新 - 修正類型
const handleFilter = (newFilter: FilterOptions) => {
  filterQuery.value = { ...createEmptyFilters(), ...newFilter }
}

const handleSort = (newSort: string) => {
  sortOrder.value = newSort
}
</script>

<style scoped>
.search-toolbar__controls {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .search-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-toolbar__search {
    min-width: 0;
    flex: 1 1 auto;
  }

  .search-toolbar__controls {
    width: 84px;
    max-width: 84px;
    flex: 0 0 84px;
    gap: 4px;
    margin-bottom: 0;
    overflow: hidden;
    opacity: 1;
    transform: translateX(0);
    transition: max-width 220ms ease, flex-basis 220ms ease, opacity 160ms ease, transform 220ms ease, gap 220ms ease, visibility 0s linear 0s;
    visibility: visible;
  }

  .search-toolbar--focused .search-toolbar__search {
    flex-basis: 100%;
  }

  .search-toolbar--focused .search-toolbar__controls {
    width: 0;
    max-width: 0;
    flex-basis: 0;
    gap: 0;
    opacity: 0;
    transform: translateX(8px);
    transition: max-width 220ms ease, flex-basis 220ms ease, opacity 160ms ease, transform 220ms ease, gap 220ms ease, visibility 0s linear 220ms;
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-toolbar__controls {
    transition: none;
  }
}
</style>
