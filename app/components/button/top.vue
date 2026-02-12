<template>
  <button
    class="w-14 h-14 cursor-pointer transition-all duration-300 rounded-full flex justify-center items-center focus:outline-none"
    style="background: var(--bg-popup-color); color: var(--brand); border: none;"
    :class="[
      'shadow-[0_4px_16px_rgba(0,0,0,0.15)]',
      'hover:shadow-[0_8px_24px_rgba(139,92,246,0.25)]',
      'hover:-translate-y-1',
      'active:translate-y-0',
    ]"
    @click="backToTop"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const backToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>
