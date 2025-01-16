<template>
    <div class="flex w-full justify-center">
        <div class="image-row">
            <ImageView v-for="image in filteredImages" :url="image.url" :alt="image.alt" class="image" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { getAllImageList } from '~/apis/base';

const config = useRuntimeConfig();

interface img {
    url: string,
    alt: string
    author: string
    episode: string
}

const images = ref<img[]>([
    // 'https://i.imgur.com/olWo9xr.jpg',
    // 'https://i.imgur.com/83sKGOi.jpg',
    // 'https://i.imgur.com/XSzy1Hq.jpg',
    // 'https://i.imgur.com/z5fMg6I.jpg',
    // 'https://i.imgur.com/rPU8WDd.jpg'
]);

const props = defineProps({
    searchQuery: String,
    filterQuery: Object
});

const getImageList = async (query: string, config: any) => {
    try {
        // images.value = await getAllImageList(query, config);
        const allFiles = await getAllImageList(query, config);
        images.value = allFiles.map((item: img) => ({
            url: item.url,
            alt: item.alt,
            author: item.author,
            episode: item.episode,
        }));

    } catch (error) {
        images.value = [];
    }
}

const filteredImages = computed(() => {
    if (!props.filterQuery.MyGO集數 && !props.filterQuery.AveMujica集數 && !props.filterQuery.MyGO人物) return images.value;

    return images.value.filter((image) => {
        const filterMyGOEpisodes = props.filterQuery.MyGO集數.length === 0 ||
            props.filterQuery.MyGO集數.includes(image.episode);

        const filterAveMujicaEpisodes = props.filterQuery.AveMujica集數.length === 0 ||
            props.filterQuery.AveMujica集數.includes(image.episode);

        const filterMyGOCharacters = props.filterQuery.MyGO人物.length === 0 ||
            props.filterQuery.MyGO人物.includes(image.author);

        return filterMyGOEpisodes && filterAveMujicaEpisodes && filterMyGOCharacters;
    });
});

// 監視 searchQuery 變化
watch(() => props.searchQuery, (newQuery) => {
    getImageList(newQuery || '', config);
}, { immediate: true });

onMounted(() => {
    getImageList('', config);
});

</script>

<style scoped>
.image-row {
    display: grid;
    /* grid-template-columns: repeat(4, 1fr); */
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