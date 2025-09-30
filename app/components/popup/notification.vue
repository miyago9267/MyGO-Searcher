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
              重新設計API路由，統一使用RESTful格式
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              加入篩選器功能，可選擇MyGO集數、AveMujica集數和人物（人物分類尚在製作中）
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              加入排序功能，可選擇四種排序方式
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              加入更新提示
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              正式加入AveMujica圖包
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3 class="m-0 mb-3 text-4 font-600 text-white">
            Change
          </h3>
          <ul class="list-none p-0 m-0">
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              重新設計前端Component及Nuxt後端架構
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              更新前端載入邏輯，從全部圖片載入改為動態滾動載入
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              優化SSR效能
            </li>
            <li class="py-2 pl-6 relative text-[#e0e0e0] leading-6 before:content-['•'] before:absolute before:left-2 before:text-[#667eea] before:font-bold">
              連線MongoDB
            </li>
          </ul>
        </div>

        <div class="bg-[#3a3a3a] border-l-4 border-l-[#667eea] p-4 rounded-lg mb-6">
          <p class="m-0 text-3.5 text-[#e0e0e0] leading-6">
            <strong>重要提醒：</strong>新版本API已上線，舊版API將逐步淘汰，建議開發者儘早遷移至新版API，詳見文檔。
          </p>
        </div>
      </div>

      <div class="p-4 pt-4 pb-6 flex justify-center">
        <button
          class="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none px-8 py-3 rounded-2 text-4 font-500 cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:translate-y--0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
          @click="closeNotification"
        >
          開始體驗新版本
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// 當前版本號 - 從 package.json 獲取
const currentVersion = '2.0.0'

// 控制通知顯示的響應式變數
const showNotification = ref(false)

// LocalStorage 鍵名
const NOTIFICATION_KEY = 'mygo-searcher-notification-seen'

// 檢查是否需要顯示通知
const checkShouldShowNotification = (): boolean => {
  try {
    const seenVersion = localStorage.getItem(NOTIFICATION_KEY)
    return seenVersion !== currentVersion
  }
  catch (error) {
    console.warn('無法讀取 localStorage:', error)
    return true // 如果無法讀取，預設顯示通知
  }
}

// 關閉通知並記錄到 localStorage
const closeNotification = (): void => {
  showNotification.value = false

  try {
    localStorage.setItem(NOTIFICATION_KEY, currentVersion)
  }
  catch (error) {
    console.warn('無法寫入 localStorage:', error)
  }
}

// 組件掛載時檢查是否需要顯示通知
onMounted(() => {
  // 延遲一點時間顯示，讓頁面完全載入
  setTimeout(() => {
    if (checkShouldShowNotification()) {
      showNotification.value = true
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
