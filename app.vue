<template>
	<NuxtPage></NuxtPage>
</template>


<style>
html,
body {
	padding: unset !important;
	margin: unset !important;
	font-family: 'Microsoft JhengHei', sans-serif;
}
</style>

<script setup lang="ts">
const onLoaded = ref(false);

useSeoMeta({
	title: 'MyGO表情包搜尋器',
	ogTitle: 'MyGO表情包搜尋器',
	description: '願意一輩子跟我組樂團嗎。MyGO表情包搜尋器，蒐集來自MyGO動畫的各種生草截圖，沒有看MyGO的人只能過上相對失敗的人生，和我一起踏上能夠僅用MyGO截圖就能聊天的人生吧。',
	ogDescription: '願意一輩子跟我組樂團嗎。MyGO表情包搜尋器，蒐集來自MyGO動畫的各種生草截圖，沒有看MyGO的人只能過上相對失敗的人生，和我一起踏上能夠僅用MyGO截圖就能聊天的人生吧。',
});

onMounted(() => {
	if (process.client) {
		onLoaded.value = true;
	}
});
</script>