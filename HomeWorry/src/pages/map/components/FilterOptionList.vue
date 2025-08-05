<template>
  <div class="option-list">
    <button
      v-for="option in options"
      :key="option"
      class="btn-med-wrapper bodyMedium14px"
      :class="{ selected: selectedOptions.includes(option) }"
      @click="toggle(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: Array // 외부 v-model 연동시 사용
})

const emit = defineEmits(['select', 'update:modelValue'])

// 내부 선택 배열 (초기값: modelValue 또는 빈배열)
const selectedOptions = ref(props.modelValue ? [...props.modelValue] : [])

watch(() => props.modelValue, (val) => {
  selectedOptions.value = val ? [...val] : []
})

function toggle(option) {
  const idx = selectedOptions.value.indexOf(option)
  if (idx === -1) {
    selectedOptions.value.push(option)
  } else {
    selectedOptions.value.splice(idx, 1)
  }
  emit('select', [...selectedOptions.value])
  emit('update:modelValue', [...selectedOptions.value])
}
</script>

<style scoped>
.option-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 24px 0 12px 0;
  align-items: center;
  justify-content: flex-start;
}

.btn-med-wrapper {
  border-radius: 12px;
  width: auto;
  min-width: 80px;
  height: 35px;
  text-align: center;
  padding: 0 20px;
  line-height: 30px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-mediumgray);
  cursor: pointer;
}

.btn-med-wrapper:hover,
.btn-med-wrapper.selected {
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
  background: rgba(17, 31, 92, 0.1);
}
</style>
