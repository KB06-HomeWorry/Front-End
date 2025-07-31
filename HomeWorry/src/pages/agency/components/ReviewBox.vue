<!-- src/pages/agency/components/ReviewItem.vue -->
<template>
  <div class="review-item">
    <div class="review-header">
      <span class="reviewer-name bodyMedium12px">익명{{ index }}</span>
      <span class="review-date bodyLight10px">{{ formattedDate }}</span>
    </div>
    <div class="review-content bodyLight12px">
      {{ content }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  index: { type: Number, required: true },  // 익명1, 익명2 ... 표시용
  date: { type: Object, required: true },   // ISO 또는 'YYYY-MM-DD'
  content: { type: String, required: true }
})

// 날짜 포맷 (예: 2024-07-25 → 2024.07.25)
const formattedDate = computed(() => {
  if (!props.date) return '';

  if (props.date[1] < 10) props.date[1] = "0" + props.date[1]
  if (props.date[2] < 10) props.date[2] = "0" + props.date[2]

  return `${props.date[0]}.${props.date[1]}.${props.date[2]}`
})
</script>

<style scoped>
.review-item {
  border-radius: 10px;
  border: 1px solid var(--color-lightgray2);
  background: #fafbfc;
  padding: 14px 15px 13px 15px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px 0 rgba(60, 68, 90, 0.02);
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.reviewer-name {
  color: var(--color-primary);
  font-weight: 600;
}

.review-date {
  color: var(--color-mediumgray);
  font-size: 11px;
}

.review-content {
  color: var(--color-darkgray, #222);
  line-height: 1.6;
  white-space: pre-line;
}
</style>
