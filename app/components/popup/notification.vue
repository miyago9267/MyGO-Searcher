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

        <div class="mb-6">
          <h3 class="m-0 mb-3 text-4 font-600 text-white">
            Feature
          </h3>
          <ul class="list-none p-0 m-0">
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              新增實驗性語義搜尋功能 (AI)，這意味著你現在可以使用自然語言搜尋表情包了！
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              引入 Transformers.js 進行本地端模型推論，保護你的隱私
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              關鍵字高亮顯示與模糊搜尋支援，打錯字也能找到結果
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              新增圖片預覽面板，點擊即可快速預覽大圖
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              新 UI 設計：優化篩選器與排序選單介面，操作更直覺
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3 class="m-0 mb-3 text-4 font-600 text-white">
            Change
          </h3>
          <ul class="list-none p-0 m-0">
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              專案架構優化：全面升級至 Nuxt 4，引入 ESLint 與單元測試環境 (Vitest)
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              開發體驗升級：CI/CD 遷移至 Bun，並導入嚴格型別檢查
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              效能優化：重構 Composables 與組件架構，提升運行效率
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              更新前端載入邏輯，改為動態滾動載入並優化 SSR 效能
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              修正通知視窗顯示位置與多處潛在問題
            </li>
          </ul>
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
import { onMounted } from 'vue'
import { useLocalStorage } from '~/composables/useLocalStorage'
import { usePopup } from '~/composables/usePopup'

// 當前版本號 - 從 package.json 獲取
const currentVersion = '2.1.0'

// LocalStorage 鍵名
const NOTIFICATION_KEY = 'mygo-searcher-notification-seen'

// 使用 composables
const { isOpen: showNotification, open: openNotification, close: closeNotificationState } = usePopup()
const { get: getSeenVersion, set: setSeenVersion } = useLocalStorage<string>(NOTIFICATION_KEY)

// 檢查是否需要顯示通知
const checkShouldShowNotification = (): boolean => {
  const seenVersion = getSeenVersion()
  return seenVersion !== currentVersion
}

// 關閉通知並記錄到 localStorage
const closeNotification = (): void => {
  closeNotificationState()
  setSeenVersion(currentVersion)
}

// 組件掛載時檢查是否需要顯示通知
onMounted(() => {
  // 延遲一點時間顯示，讓頁面完全載入
  setTimeout(() => {
    if (checkShouldShowNotification()) {
      openNotification()
    }
  }, 1000)
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
