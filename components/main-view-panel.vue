<template>
    <div class="flex flex-col w-full justify-center">
        <div class="image-row">
            <image-view-card v-for="image in filteredImages" :key="image.id" :url="image.url" :alt="image.alt"
                class="image" />
        </div>

        <!-- 載入狀態 -->
        <div v-if="loading" class="flex justify-center mt-4">
            <div class="text-gray-400">載入中...</div>
        </div>

        <!-- 錯誤狀態 -->
        <div v-if="error" class="flex justify-center mt-4">
            <div class="text-red-400">{{ error }}</div>
        </div>

        <!-- 無限滾動觸發器 -->
        <div 
            v-if="hasMore && !loading" 
            ref="loadMoreTrigger" 
            class="flex justify-center mt-4 py-8 min-h-[100px]"
            style="background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.05));">
            <div class="text-gray-400">繼續滾動載入更多...</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useImages, useImageFilter } from '~/composables/useImages'
import type { FilterOptions } from '~/types'

interface Props {
    sortOrder?: string
    searchQuery?: string
    filterQuery?: FilterOptions
}

const props = withDefaults(defineProps<Props>(), {
    sortOrder: 'id',
    searchQuery: '',
    filterQuery: () => ({
        MyGO集數: [],
        AveMujica集數: [],
        人物: []
    })
})

// 使用 useImages 組合式函數
const {
    images,
    loading,
    error,
    hasMore,
    search,
    fetchImages,
    setSortOrder,
    initInfiniteScroll,
    cleanupInfiniteScroll
} = useImages({
    initialQuery: props.searchQuery,
    sortOrder: props.sortOrder || 'id',
    pageSize: 20,
    fuzzySearch: false
})

// 將 filterQuery 轉換為 ref
const filterQuery = computed(() => props.filterQuery || {
    MyGO集數: [],
    AveMujica集數: [],
    人物: []
})

// 使用篩選功能
const { filteredImages } = useImageFilter(images, filterQuery)

// 無限滾動觸發器元素
const loadMoreTrigger = ref<HTMLElement>()

// 監聽搜尋查詢變化
watch(() => props.searchQuery, (newQuery) => {
    if (newQuery !== undefined) {
        search(newQuery)
    }
}, { immediate: true })

// 監聽排序方式變化
watch(() => props.sortOrder, async (newSortOrder) => {
    if (newSortOrder) {
        // 使用 setSortOrder 函數來更新排序並重新載入數據
        await setSortOrder(newSortOrder)
    }
})

// 當有更多數據且觸發器存在時，初始化無限滾動
watch([hasMore, loadMoreTrigger], async ([newHasMore, newTrigger]) => {
    if (newHasMore && newTrigger) {
        await nextTick()
        initInfiniteScroll(newTrigger)
    }
}, { flush: 'post' })

// 監聽圖片載入完成，重新設置觀察器
watch(images, async () => {
    if (hasMore.value && loadMoreTrigger.value) {
        await nextTick()
        initInfiniteScroll(loadMoreTrigger.value)
    }
}, { flush: 'post' })

// 調試：監聽 hasMore 變化
watch(hasMore, (newHasMore) => {
    console.log('hasMore 變化:', newHasMore)
})

// 調試：監聽 loading 變化
watch(loading, (newLoading) => {
    console.log('loading 變化:', newLoading)
})

// 初始載入
onMounted(async () => {
    if (!props.searchQuery) {
        await fetchImages('', 1, false)
    }

    // 等待DOM更新後設置無限滾動
    await nextTick()
    if (hasMore.value && loadMoreTrigger.value) {
        initInfiniteScroll(loadMoreTrigger.value)
    }
})

// 清理觀察器
onUnmounted(() => {
    cleanupInfiniteScroll()
})
</script>

<style scoped>
.image-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(16rem, 1fr));
    gap: 10px;
    margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
    .image-row {
        grid-template-columns: repeat(1, 1fr);
    }
}

@media screen and (max-width: 1024px) {
    .image-row {
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    }
}
</style>