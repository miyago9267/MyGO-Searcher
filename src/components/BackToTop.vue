<template>
    <button @click="backToTop" class="back-to-top flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M12 2l-10 10h6v10h8v-10h6z"/>
        </svg>
    </button>
</template>

<script setup lang="ts">

const backToTop = () => {
    window.scrollTo(0, 0);
}

</script>

<style scoped>
.back-to-top {
    padding: 0.75rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
    background-color: rgb(75 85 99);
    border-radius: 9999px;
    border-width: 1px;
    border-color: rgb(31 41 55) !important;
}
.back-to-top:hover {
  opacity: 1;
}
button:focus,
button:focus-visible {
  outline: none;
}


</style>