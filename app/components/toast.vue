<template>
  <Transition name="toast-transition">
    <div
      v-if="message"
      :class="[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 rounded-lg min-w-[200px] max-w-[500px] text-center overflow-hidden',
        'shadow-[0_10px_40px_rgba(0,0,0,0.25)]',
        toastClasses,
      ]"
    >
      <p class="text-sm font-medium relative z-10">
        {{ message }}
      </p>
      <div
        v-if="message && shouldAnimate"
        :key="progressKey"
        class="toast-progress-bar absolute bottom-0 left-0 h-1 bg-white/30"
        :style="{ animationDuration: `${duration}ms` }"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useAppToast } from '~/composables/useToast'

defineOptions({
  name: 'ToastNotification',
})

const { message, type, duration } = useAppToast()
const progressKey = ref(0)
const shouldAnimate = ref(false)

watch(message, (newMessage) => {
  if (newMessage) {
    shouldAnimate.value = false
    nextTick(() => {
      progressKey.value++
      setTimeout(() => {
        shouldAnimate.value = true
      }, 50)
    })
  }
  else {
    shouldAnimate.value = false
  }
})

const toastClasses = computed(() => {
  switch (type.value) {
    case 'success':
      return 'bg-green-500 dark:bg-green-600 text-white'
    case 'error':
      return 'bg-red-500 dark:bg-red-600 text-white'
    case 'warning':
      return 'bg-yellow-500 dark:bg-yellow-600 text-white'
    case 'info':
    default:
      return 'bg-blue-500 dark:bg-blue-600 text-white'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-progress-bar {
  width: 100%;
  animation: toast-progress linear forwards;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
