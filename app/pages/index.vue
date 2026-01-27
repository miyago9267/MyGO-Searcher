<template>
  <div class="flex flex-col w-screen h-full bg-[--bg-default]">
    <Header class="outline outline-offset-0 outline-[--outline] outline-2" />
    <div class="p-10">
      <search-bar
        class="mb-5"
        :semantic-enabled="isSemantic"
        @update:search="handleSearch"
        @update:semantic="isSemantic = $event"
      />
      <div class="flex w-full justify-end">
        <button-sort
          class="mb-5"
          @update:sort="handleSort"
        />
        <button-filter
          class="mb-5"
          @update:filter="handleFilter"
        />
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
    <button-top class="fixed bottom-5 right-5" />
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
