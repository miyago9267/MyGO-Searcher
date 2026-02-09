<template>
  <div
    v-if="showNotification"
    class="fixed inset-0 bg-black/80 backdrop-blur-2 flex items-center justify-center z-[9999]"
    @click="closeNotification"
  >
    <div
      class="bg-[#2a2a2a] border border-[#404040] rounded-4 max-w-125 w-90% max-h-80vh overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-slide-up"
      @click.stop
    >
      <div class="flex justify-between items-center p-6 border-b border-[#404040]">
        <h2 class="m-0 text-5 font-600 text-white">
          更新公告
        </h2>
        <button
          class="bg-transparent border-none text-6 text-[#b0b0b0] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-2 transition-all duration-200 hover:bg-[#404040] hover:text-white leading-none"
          @click="closeNotification"
        >
          ×
        </button>
      </div>

      <div class="px-6">
        <div class="inline-block bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-5 text-3.5 font-500 mb-6 shadow-[0_2px_8px_rgba(102,126,234,0.3)]">
          Version {{ currentVersion }}
        </div>

        <div v-if="changelog && changelog.sections">
          <div v-for="(items, sectionName) in changelog.sections" :key="sectionName" class="mb-6">
            <h3 class="m-0 mb-3 text-4 font-600 text-white">
              {{ sectionName }}
            </h3>
            <ul class="list-none p-0 m-0">
              <li
                v-for="item in items"
                :key="item"
                class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        
        <div v-else-if="status === 'pending'" class="text-white text-center py-4">
          載入更新資訊中...
        </div>
        
        <div v-else class="text-white text-center py-4">
          暫無更新資訊
        </div>
      </div>

      <div class="p-4 pt-4 pb-6 flex justify-center">
        <button
          class="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none px-8 py-3 rounded-2 text-4 font-500 cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:translate-y--0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
          @click="closeNotification"
        >
          開始體驗
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useLocalStorage } from '~/composables/useLocalStorage'
import { usePopup } from '~/composables/usePopup'

// 定義 API 回傳型別
interface ChangelogData {
  version: string
  sections: Record<string, string[]>
}

// LocalStorage 鍵名
const NOTIFICATION_KEY = 'mygo-searcher-notification-seen'

// 使用 composables
const { isOpen: showNotification, open: openNotification, close: closeNotificationState } = usePopup()
const { get: getSeenVersion, set: setSeenVersion } = useLocalStorage<string>(NOTIFICATION_KEY)

// 獲取 Changelog 資料
const { data: changelog, status } = await useFetch<ChangelogData>('/api/v1/changelog')

// 當前版本號 (從 API 獲取)
const currentVersion = computed(() => changelog.value?.version || '')

// 檢查是否需要顯示通知
const checkShouldShowNotification = (): boolean => {
  if (!currentVersion.value) return false
  const seenVersion = getSeenVersion()
  return seenVersion !== currentVersion.value
}

// 關閉通知並記錄到 localStorage
const closeNotification = (): void => {
  closeNotificationState()
  if (currentVersion.value) {
    setSeenVersion(currentVersion.value)
  }
}

// 組件掛載時檢查是否需要顯示通知
onMounted(() => {
  // 延遲一點時間顯示，讓頁面完全載入
  setTimeout(() => {
    // 確保資料已載入
    if (status.value === 'success' && checkShouldShowNotification()) {
      openNotification()
    }
  }, 1000)
})

// 監聽 status 變化，如果是非 SSR 情況下 mounted 時資料還沒好
watch(status, (newStatus) => {
  if (newStatus === 'success') {
    // 如果資料載入完成且視窗尚未開啟 (避免重複開啟)
    if (!showNotification.value && checkShouldShowNotification()) {
       // 這裡不自動開啟，維持 onMounted 的延遲邏輯，或是由 onMounted 控制
       // 但如果是 CSR，onMounted 時可能 data 還是 null
    }
  }
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* 自定義滾輪樣式 */
.max-h-80vh::-webkit-scrollbar {
  width: 8px;
}

.max-h-80vh::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 4px;
}

.max-h-80vh::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.max-h-80vh::-webkit-scrollbar-thumb:hover {
  background: #5a5a5a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.max-h-80vh::-webkit-scrollbar-thumb:active {
  background: #6a6a6a;
}

/* Firefox 滾輪樣式 */
.max-h-80vh {
  scrollbar-width: thin;
  scrollbar-color: #4a4a4a #1a1a1a;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .max-w-125 {
    width: 95%;
    margin: 1rem;
  }

  /* 移動端滾輪樣式調整 */
  .max-h-80vh::-webkit-scrollbar {
    width: 6px;
  }
}
</style>
