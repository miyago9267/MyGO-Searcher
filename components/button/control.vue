<template>
  <button
    type="button"
    :class="['toolbar-control', { 'toolbar-control--active': active }]"
    :aria-expanded="expanded"
    @click="emit('click')"
  >
    <span class="control-icon" aria-hidden="true"><slot name="icon" /></span>
    <span>{{ label }}</span>
    <span v-if="count" class="control-badge">{{ count }}</span>
    <span v-else-if="detail" class="control-detail">{{ detail }}</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  active?: boolean
  expanded?: boolean
  count?: number
  detail?: string
}>(), {
  active: false,
  expanded: false,
  count: 0,
  detail: ''
})

const emit = defineEmits<{ click: [] }>()
</script>

<style scoped>
.toolbar-control {
  display: inline-flex;
  min-width: 104px;
  height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 0 13px;
  border: 1px solid #444;
  border-radius: 12px;
  outline: 0;
  background: #242424;
  color: #eee;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.toolbar-control:hover {
  border-color: #6a6a6a;
  background: #292929;
}

.toolbar-control:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 2px;
}

.toolbar-control--active {
  border-color: #22d3ee;
  background: rgb(34 211 238 / 10%);
  color: #a5f3fc;
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
  background: #22d3ee;
  color: #102023;
  font-size: 11px;
  font-weight: 900;
}

.control-detail {
  max-width: 64px;
  overflow: hidden;
  background: #353535;
  color: #bbb;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-control--active .control-detail {
  background: #22d3ee;
  color: #102023;
}
</style>
