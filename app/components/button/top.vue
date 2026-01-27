<template>
  <button
    class="p-3 cursor-pointer opacity-70 transition-opacity duration-300 bg-gray-600 rounded-full border border-gray-800 flex justify-center items-center hover:opacity-100 focus:outline-none"
    @click="backToTop"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="24"
      height="24"
    >
      <path d="M12 2l-10 10h6v10h8v-10h6z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const backToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>
/* 
所有樣式已轉換為 UnoCSS：
.back-to-top -> p-3 cursor-pointer opacity-70 transition-opacity bg-gray-600 rounded-full border border-gray-800
.back-to-top:hover -> hover:opacity-100
button:focus -> focus:outline-none
*/
</style>
