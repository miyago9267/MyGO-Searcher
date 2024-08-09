<template>
    <button @click="backToTop" class="h-16 w-16 rounded-full border-gray-8 bg-gray-6 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l-10 10h6v10h8v-10h6z"/>
        </svg>
    </button>
</template>

<script setup lang="ts">

const backToTop = () => {
    window.scrollTo(0, 0);
}

</script>