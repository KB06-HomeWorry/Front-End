<template>
  <div class="range-slider">
    <div class="slider-label bodyMedium16px">

      <template v-if="minValue === min && maxValue === max"> 전체 </template>
      <template v-else>
        {{ minValue }}평 ({{ toM2(minValue) }}㎡) ~ {{ maxValue }}평 ({{ toM2(maxValue) }}㎡)
      </template>
    </div>

    <div class="slider-row">
      <div class="slider-track"></div>
      <div class="slider-range" :style="rangeStyle"></div>

      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="minValue"
        @input="fixMin"
        @mousedown="onDragStart"
        @mouseup="onDragEnd"
        @touchstart="onDragStart"
        @touchend="onDragEnd"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="maxValue"
        @input="fixMax"
        @mousedown="onDragStart"
        @mouseup="onDragEnd"
        @touchstart="onDragStart"
        @touchend="onDragEnd"
      />
    </div>

    <div class="slider-marks bodyLight14px">
      <span>최소</span>
      <span>8평</span>
      <span>12평</span>
      <span>최대</span>
    </div>
    <button class="apply-btn" @click="onApplyClick">적용</button>
    <button class="reset-btn bodyMedium14px" @click="reset">초기화</button>
  </div>
</template>

<script setup>

import { ref, computed, watch, onUnmounted, defineEmits } from 'vue'

// Props to accept external values
const props = defineProps({
  minValue: {
    type: Number,
    default: null,
  },
  maxValue: {
    type: Number,
    default: null,
  },
})

// Emit changes to parent
const emit = defineEmits(['change'])

const min = 5,
  max = 20
const minGap = 1 // 최소 포인터와 최대 포인터 사이의 최소 간격

// Use props or defaults
const minValue = ref(props.minValue !== null ? props.minValue : min)
const maxValue = ref(props.maxValue !== null ? props.maxValue : max)

// Track if user is currently dragging
const isDragging = ref(false)
let debounceTimer = null

// Watch for prop changes and update local values (only from parent)
watch(
  () => props.minValue,
  (newVal) => {
    if (newVal !== null) {
      minValue.value = newVal
    }
  },
)

watch(
  () => props.maxValue,
  (newVal) => {
    if (newVal !== null) {
      maxValue.value = newVal
    }
  },
)

const emit= defineEmits(['apply','close'])
// const props = defineProps({
//   areaRange: Object,
// });

function onApplyClick() {
  emit('apply', { min: minValue.value, max: maxValue.value }); // ✅ 수정// 필터 적용
  emit('close'); // 모달 닫기
}


// 선택된 범위의 스타일을 계산
const rangeStyle = computed(() => {
  const range = max - min
  const leftPercent = ((minValue.value - min) / range) * 100
  const rightPercent = ((max - maxValue.value) / range) * 100

  return {
    left: `${leftPercent}%`,
    right: `${rightPercent}%`,
  }
})

function toM2(py) {
  return Math.round(py * 3.3)
}

// Handle drag start
function onDragStart() {
  isDragging.value = true
  // Clear any pending timer when starting to drag
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

// Handle drag end
function onDragEnd() {
  isDragging.value = false
  // Emit after user stops dragging
  emitChange()
}

// Emit changes to parent
function emitChange() {
  emit('change', {
    min: minValue.value,
    max: maxValue.value,
  })
}

// 최소 값 포인터가 최대 값을 넘지 않도록 하였음
function fixMin() {
  if (maxValue.value - minValue.value < minGap) {
    minValue.value = maxValue.value - minGap
  }
  // Only emit if not currently dragging (for programmatic changes)
  if (!isDragging.value) {
    emitChange()
  }
}

// 최대 값 포인터가 최소 값보다 내려가지 않도록 보정
function fixMax() {
  if (maxValue.value - minValue.value < minGap) {
    maxValue.value = minValue.value + minGap
  }
  // Only emit if not currently dragging (for programmatic changes)
  if (!isDragging.value) {
    emitChange()
  }
}

function reset() {
  minValue.value = min
  maxValue.value = max
  // Clear any pending timer and emit immediately for reset
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  emitChange()
}


// Clean up timer on component unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

</script>

<style scoped>
.range-slider {
  padding: 18px 12px;
  background: #fff;
}
.slider-label {
  color: var(--color-primary);
  margin-bottom: 20px;
}

.slider-row {
  position: relative;
  height: 20px;
}

.slider-track,
input[type='range'] {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 20px);
  margin: 0;
}

.slider-range {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 5px;
  background-color: var(--color-primary);
  border-radius: 5px;
  z-index: 2;
}
.slider-track {
  background-color: var(--color-lightgray);
  height: 5px;
  border-radius: 5px;
  z-index: 1;
}

input[type='range'] {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  margin: 0;
  z-index: 3;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 20px;
  height: 20px;
  background: #fff;
  border: 1.5px solid var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  margin-top: -7.5px;
}

/* 기존 인풋 트랙 스타일 제거하고 직접 조정 */
input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 5px;
  background: none;
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: var(--color-mediumgray);
}

.reset-btn {
  width: 80px;
  height: 25px;
  display: block;
  margin: 16px auto 0;
  background: none;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  color: var(--color-white);
  background: var(--color-primary);
  cursor: pointer;
  line-height: 25px;
}

.apply-btn {
  width: 80px;
  height: 25px;
  background: var(--color-primary);
  color: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  cursor: pointer;
  line-height: 25px;
  font-size: 14px;
  padding: 0;
}
</style>