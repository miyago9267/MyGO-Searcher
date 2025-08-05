
<template>
    <div class="flex flex-col w-screen h-full bg-tggray-50">
        <Header class="outline outline-offset-0 outline-tggray-300 outline-2" />
        <div class="p-10">
            <search-bar class="mb-5" @update:search="handleSearch"/>
            <div class="flex w-full justify-end">
              <button-sort class="mb-5" @update:sort="handleSort"/>
              <button-filter class="mb-5" @update:filter="handleFilter"/>
            </div>
            <main-view-panel class="mt-5" :searchQuery="searchQuery" :filterQuery="filterQuery" :sortOrder="sortOrder"> </main-view-panel>
        </div>
        <Footer class=""/>
    </div>
    <button-top class="fixed bottom-5 right-5"/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterOptions } from '~/types'

// 使用正確的類型定義
const searchQuery = ref<string>('')
const sortOrder = ref<string>('id')
const filterQuery = ref<FilterOptions>({
  MyGO集數: [],
  AveMujica集數: [],
  人物: []
})

// 處理搜尋更新
const handleSearch = (newSearch: string) => {
  searchQuery.value = newSearch
}

// 處理篩選更新 - 修正類型
const handleFilter = (newFilter: FilterOptions) => {
  filterQuery.value = newFilter
}

const handleSort = (newSort: string) => {
  sortOrder.value = newSort
}

</script>