<template>
  <div class="back-to-top-slot">
    <Transition name="back-to-top">
      <button
        v-if="isVisible"
        class="back-to-top"
        type="button"
        aria-label="回到頁面頂端"
        title="回到頁面頂端"
        @click="backToTop"
      >
        <svg
          class="back-to-top__arrow"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isVisible = ref(false)
const updateVisibility = () => {
  isVisible.value = window.scrollY > 320
}

const backToTop = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<style scoped>
.back-to-top-slot {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 50;
  pointer-events: none;
}

.back-to-top {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  padding: 0;
  color: var(--font-default);
  cursor: pointer;
  pointer-events: auto;
  background: var(--bg-popup-color);
  border: 1px solid var(--border);
  border-radius: 9999px;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(10px);
  transition: color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.back-to-top:hover {
  color: var(--brand);
  border-color: var(--brand);
  transform: translateY(-2px);
}

.back-to-top:active {
  transform: translateY(0) scale(.95);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

.back-to-top__arrow {
  width: 1.35rem;
  height: 1.35rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.back-to-top:hover .back-to-top__arrow {
  animation: arrow-nudge 650ms ease-in-out infinite alternate;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(.75rem) scale(.88);
}

@keyframes arrow-nudge {
  to {
    transform: translateY(-2px);
  }
}

@media (max-width: 640px) {
  .back-to-top-slot {
    right: 1rem;
    bottom: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .back-to-top__arrow,
  .back-to-top-enter-active,
  .back-to-top-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
