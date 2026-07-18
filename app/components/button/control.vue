<template>
  <button
    type="button"
    :class="['toolbar-control', { 'toolbar-control--active': active }]"
    :aria-expanded="expanded"
    :aria-label="accessibilityLabel"
    @click="emit('click')"
  >
    <span
      class="control-icon"
      aria-hidden="true"
    ><slot name="icon" /></span>
    <span class="control-label">{{ label }}</span>
    <span
      v-if="count"
      class="control-badge"
    >{{ count }}</span>
    <span
      v-else-if="detail"
      class="control-detail"
    >{{ detail }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  active?: boolean
  expanded?: boolean
  count?: number
  detail?: string
}>(), {
  active: false,
  expanded: false,
  count: 0,
  detail: '',
})

const accessibilityLabel = computed(() => {
  if (props.count) return `${props.label}，已套用 ${props.count} 個篩選`
  if (props.detail) return `${props.label}，目前${props.detail}`
  return props.label
})

const emit = defineEmits<{ click: [] }>()
</script>

<style scoped>
.toolbar-control {
  display: inline-flex;
  min-width: 104px;
  height: 40px;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 0 13px;
  border: 1px solid var(--border);
  border-radius: 12px;
  outline: 0;
  background: var(--bg-popup-color);
  color: var(--font-default);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.toolbar-control:hover {
  border-color: var(--font-gray);
  background: var(--bg-hover);
}

.toolbar-control:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.toolbar-control--active {
  border-color: var(--brand);
  background: color-mix(in srgb, var(--brand) 12%, var(--bg-popup-color));
  color: var(--brand);
}

.control-icon {
  display: grid;
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  place-items: center;
}

.control-icon :deep(svg) {
  display: block;
  width: 17px;
  height: 17px;
}

.control-badge,
.control-detail {
  display: grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  padding: 0 6px;
  border-radius: 7px;
  background: var(--brand);
  color: var(--font-white);
  font-size: 11px;
  font-weight: 900;
}

.control-detail {
  max-width: 64px;
  overflow: hidden;
  background: var(--bg-sub);
  color: var(--font-gray);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-control--active .control-detail {
  background: var(--brand);
  color: var(--font-white);
}

@media (max-width: 480px) {
  .toolbar-control {
    width: 40px;
    min-width: 40px;
    height: 40px;
    padding: 0;
    gap: 0;
    border-color: transparent;
    background: transparent;
  }

  .toolbar-control:hover,
  .toolbar-control:focus-visible {
    border-color: transparent;
    background: var(--bg-hover);
  }

  .toolbar-control--active {
    border-color: transparent;
    background: color-mix(in srgb, var(--brand) 12%, transparent);
  }

  .control-label,
  .control-detail {
    display: none;
  }

  .control-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border: 2px solid var(--bg-default);
    border-radius: 999px;
    font-size: 10px;
  }
}
</style>
