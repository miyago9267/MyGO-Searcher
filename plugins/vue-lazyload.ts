import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueLazyload, {
    preLoad: 1.3,
    error: '/error.png',  // 錯誤時顯示的圖片路徑
    loading: '/loading.gif',  // 載入中的圖片
    attempt: 1,  // 嘗試次數
  });
});