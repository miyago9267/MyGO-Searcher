
<template>
    <div class="flex flex-col w-screen h-full bg-tggray-50">
        <Header class="outline outline-offset-0 outline-tggray-300 outline-2" />
        <div class="p-10">
            <search-bar class="mb-5" @update:search="handleSearch"/>
            <filter-button class="mb-5" @update:filter="handleFilter"/>
            <main-view-panel class="mt-5" :searchQuery="searchQuery" :filterQuery="filterQuery"> </main-view-panel>
        </div>
        <Footer class=""/>
    </div>
    <top-button class="fixed bottom-5 right-5"/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterOptions } from '~/types'

// 使用正確的類型定義
const searchQuery = ref<string>('')
const filterQuery = ref<FilterOptions>({
  MyGO集數: [],
  AveMujica集數: [],
  人物: []
})

// 處理搜尋更新
const handleSearch = (newSearch: string) => {
  searchQuery.value = newSearch
  console.log('搜尋查詢更新:', newSearch)
}

// 處理篩選更新 - 修正類型
const handleFilter = (newFilter: FilterOptions) => {
  filterQuery.value = newFilter
  console.log('篩選條件更新:', newFilter)
}

// 監聽變化以進行調試
watch(searchQuery, (newValue) => {
  console.log('搜尋查詢變化:', newValue)
})

watch(filterQuery, (newValue) => {
  console.log('篩選條件變化:', newValue)
}, { deep: true })

</script>