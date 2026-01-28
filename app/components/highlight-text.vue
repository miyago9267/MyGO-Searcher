<template>
  <span class="highlight-text">
    <template
      v-for="(segment, index) in segments"
      :key="index"
    >
      <mark
        v-if="segment.isMatch"
        class="highlight-mark"
        :class="`highlight-${segment.matchType}`"
      >
        {{ segment.text }}
      </mark>
      <span v-else>{{ segment.text }}</span>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { MatchInfo } from '~/types'

interface Props {
  text: string
  matches?: MatchInfo[]
}

const props = defineProps<Props>()

interface TextSegment {
  text: string
  isMatch: boolean
  matchType?: 'exact' | 'fuzzy' | 'variant'
}

const segments = computed<TextSegment[]>(() => {
  if (!props.matches || props.matches.length === 0) {
    return [{ text: props.text, isMatch: false }]
  }

  const result: TextSegment[] = []
  let lastIndex = 0

  // 按照 startIndex 排序 matches
  const sortedMatches = [...props.matches].sort((a, b) => a.startIndex - b.startIndex)

  for (const match of sortedMatches) {
    // 添加匹配前的文字
    if (match.startIndex > lastIndex) {
      result.push({
        text: props.text.substring(lastIndex, match.startIndex),
        isMatch: false,
      })
    }

    // 添加匹配的文字
    result.push({
      text: props.text.substring(match.startIndex, match.endIndex),
      isMatch: true,
      matchType: match.matchType,
    })

    lastIndex = match.endIndex
  }

  // 添加最後剩餘的文字
  if (lastIndex < props.text.length) {
    result.push({
      text: props.text.substring(lastIndex),
      isMatch: false,
    })
  }

  return result
})
</script>

<style scoped>
.highlight-text {
  display: inline;
}

.highlight-mark {
  background-color: transparent;
  color: var(--brand);
  padding: 0;
  font-weight: 600;
  transition: all 0.2s ease;
}

.highlight-exact {
  color: var(--brand);
}

.highlight-variant {
  color: var(--pink);
}

.highlight-fuzzy {
  color: var(--magenta);
}

.highlight-mark:hover {
  text-decoration: underline;
  transform: none;
}
</style>
