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
  index: { type: Number, required: true }, 
  date: { type: Object, required: true }, 
  content: { type: String, required: true }
})

// 날짜 포맷 (2025-10-11 → 2025.10.11)
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
}

.review-date {
  color: var(--color-darkgray);
}

.review-content {
  color: var(--color-black);
  line-height: 1.4;
  white-space: pre-line;
}
</style>
