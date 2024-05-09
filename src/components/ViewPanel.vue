<template>
<div class="flex w-full justify-center">
    <div class="image-row">
      <ImageView v-for="image in images" :url="image.url" :alt="image.alt" class="image" />
    </div>
</div>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';
import ImageView from './ImageView.vue';

interface img {
    url: string,
    alt: string
}

const images = ref<img[]>([
    // 'https://i.imgur.com/olWo9xr.jpg',
    // 'https://i.imgur.com/83sKGOi.jpg',
    // 'https://i.imgur.com/XSzy1Hq.jpg',
    // 'https://i.imgur.com/z5fMg6I.jpg',
    // 'https://i.imgur.com/rPU8WDd.jpg'
]);

const props = defineProps({
  searchQuery: String
});

const getImageList = async (query: string) => {
  try {
    let url = 'https://mygoapi.miyago9267.com/mygo';
    if (query) {
      url = `${url}/img?keyword=${query}`;
    } else {
      url = `${url}/all_img`;
    }
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        images.value = data.urls;
      })
  } catch (error) {
    images.value = [];
  }
}

// 監視 searchQuery 變化
watch(() => props.searchQuery, (newQuery) => {
  getImageList(newQuery || '');
}, { immediate: true });

getImageList('');

</script>

<style scoped>
.image-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
  .image-row {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>