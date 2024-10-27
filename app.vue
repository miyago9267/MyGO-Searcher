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
	title: 'Nuxt-Template',
	ogTitle: 'Nuxt-Template',
	description: 'Nuxt-Template',
	ogDescription: 'Nuxt-Template',
});

onMounted(() => {
	if (process.client) {
		onLoaded.value = true;
	}
});
</script>