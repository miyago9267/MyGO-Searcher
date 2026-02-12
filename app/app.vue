<template>
  <ColorScheme
    tag="div"
    placeholder=" "
    class="min-h-screen"
  >
    <NuxtLoadingIndicator />
    <NuxtPage />
    <PopupNotification />
    <Toast />
  </ColorScheme>
</template>

<script setup lang="ts">
import '~/assets/css/theme.css'
import '~/assets/css/default.css'

useSeoMeta({
  title: 'MyGO表情包搜尋器',
  ogTitle: 'MyGO表情包搜尋器',
  description: '願意一輩子跟我組樂團嗎。MyGO表情包搜尋器，蒐集來自MyGO動畫的各種生草截圖，沒有看MyGO的人只能過上相對失敗的人生，和我一起踏上能夠僅用MyGO截圖就能聊天的人生吧。',
  ogDescription: '願意一輩子跟我組樂團嗎。MyGO表情包搜尋器，蒐集來自MyGO動畫的各種生草截圖，沒有看MyGO的人只能過上相對失敗的人生，和我一起踏上能夠僅用MyGO截圖就能聊天的人生吧。',
  ogImage: 'https://drive.miyago9267.com/d/file/img/searcher/mygo/10/%E8%AE%93%E6%88%91%E5%80%91%E4%B8%80%E8%B5%B7%E8%BF%B7%E5%A4%B1%E5%90%A7.jpg?t=1754412271131',
  twitterCard: 'summary_large_image',
  twitterTitle: 'MyGo表情包搜尋器',
  twitterDescription: '你願意一輩子跟我組樂團嗎。MyGO表情包搜尋器，蒐集來自MyGO動畫的各種生草截圖，沒有看MyGO的人只能過上相對失敗的人生，和我一起踏上能夠僅用MyGO截圖就能聊天的人生吧。',
  twitterImage: 'https://drive.miyago9267.com/d/file/img/searcher/mygo/10/%E8%AE%93%E6%88%91%E5%80%91%E4%B8%80%E8%B5%B7%E8%BF%B7%E5%A4%B1%E5%90%A7.jpg?t=1754412271131',
})

const colorMode = useColorMode()

onMounted(() => {
  colorMode.preference = 'dark'
})
</script>

<style>
html,
body {
  padding: unset !important;
  margin: unset !important;
  background-color: var(--bg-default);
  color: var(--font-default);
  font-family: "Noto Sans TC", sans-serif;
}
</style>
