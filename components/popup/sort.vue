<template>
  <div v-if="show" class="dismiss-layer" aria-hidden="true" @click="handleClose" />

  <Transition name="sort-popover">
    <section v-if="show" class="sort-popover" role="dialog" aria-labelledby="sort-title">
      <header class="sort-header">
        <div>
          <h2 id="sort-title">排序方式</h2>
          <p>選擇圖片的排列順序</p>
        </div>
        <button type="button" class="close-button" aria-label="關閉排序" @click="handleClose">
          <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      </header>

      <div class="sort-options" role="radiogroup" aria-label="排序方式">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          type="button"
          role="radio"
          :aria-checked="modelValue === option.value"
          :class="['sort-option', { 'sort-option--selected': modelValue === option.value }]"
          @click="selectSort(option.value)"
        >
          <span class="option-code">{{ option.code }}</span>
          <span class="option-copy">
            <strong>{{ option.label }}</strong>
            <small>{{ option.description }}</small>
          </span>
          <span class="selection-mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 8.5L6.5 11L12 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  </Transition>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{
  show: boolean
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  close: []
}>()

const sortOptions = [
  { label: '預設排序', value: 'id', code: 'ID', description: '依原始編號排列' },
  { label: '熱門優先', value: 'popularity', code: 'TOP', description: '人氣較高的圖片優先' },
  { label: '依集數', value: 'episode', code: 'EP', description: '先作品，再依集數排列' },
  { label: '依字序', value: 'alphabetical', code: 'AZ', description: '按照台詞文字排列' },
  { label: '隨機排序', value: 'random', code: 'RNG', description: '重新洗牌目前結果' }
]

const selectSort = (value: string) => {
  emit('update:modelValue', value)
  emit('close')
}

const handleClose = () => emit('close')
const handleKeydown = (event: KeyboardEvent) => {
  if (props.show && event.key === 'Escape') handleClose()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.dismiss-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: transparent;
}

.sort-popover {
  position: absolute;
  z-index: 100;
  top: calc(100% + 10px);
  right: 0;
  width: 360px;
  overflow: hidden;
  border: 1px solid #404040;
  border-radius: 16px;
  background: #252525;
  box-shadow: 0 20px 60px rgb(0 0 0 / 50%);
}

.sort-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 17px 14px;
  border-bottom: 1px solid #383838;
}

.sort-header h2 {
  margin: 0;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.2;
}

.sort-header p {
  margin: 3px 0 0;
  color: #929292;
  font-size: 12px;
}

.close-button,
.sort-option {
  margin: 0;
  border: 0;
  outline: 0;
  font-family: inherit;
}

.close-button {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  padding: 0;
  border: 1px solid #454545;
  border-radius: 50%;
  background: #1d1d1d;
  color: #aaa;
}

.close-icon {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.close-button:hover {
  border-color: #666;
  color: #fff;
}

.sort-options {
  display: grid;
  gap: 6px;
  padding: 9px;
}

.sort-option {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 24px;
  min-height: 58px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  color: #aaa;
  text-align: left;
  transition: border-color 120ms ease, background 120ms ease;
}

.sort-option:hover {
  border-color: #414141;
  background: #2d2d2d;
}

.sort-option:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: -2px;
}

.sort-option--selected {
  border-color: rgb(34 211 238 / 48%);
  background: rgb(34 211 238 / 8%);
}

.option-code {
  display: grid;
  min-width: 40px;
  height: 32px;
  place-items: center;
  border-radius: 8px;
  background: #333;
  color: #bbb;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .04em;
}

.sort-option--selected .option-code {
  background: #22d3ee;
  color: #102023;
}

.option-copy {
  display: grid;
  gap: 2px;
}

.option-copy strong {
  color: #eee;
  font-size: 13px;
  font-weight: 800;
}

.option-copy small {
  color: #858585;
  font-size: 11px;
}

.selection-mark {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border: 1px solid #494949;
  border-radius: 50%;
  color: transparent;
}

.selection-mark svg {
  width: 14px;
  height: 14px;
}

.sort-option--selected .selection-mark {
  border-color: #22d3ee;
  background: #22d3ee;
  color: #102023;
}

.sort-popover-enter-active,
.sort-popover-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
  transform-origin: top right;
}

.sort-popover-enter-from,
.sort-popover-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(.98);
}

@media (max-width: 640px) {
  .dismiss-layer {
    background: rgb(0 0 0 / 64%);
    backdrop-filter: blur(4px);
  }

  .sort-popover {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 18px 18px 0 0;
  }

  .sort-popover-enter-active,
  .sort-popover-leave-active {
    transform-origin: bottom center;
  }

  .sort-popover-enter-from,
  .sort-popover-leave-to {
    transform: translateY(12px);
  }
}
</style>
