<template>
  <div class="range-slider">
    <div class="slider-label bodyMedium16px">
      <template v-if="minValue === min && maxValue === max">
        전체
      </template>
      <template v-else>
        {{ leftLabel }} ~ {{ rightLabel }}
      </template>
    </div>

    <div class="slider-row">
      <div class="slider-track"></div>
      <div class="slider-range" :style="rangeStyle"></div>

      <input
        type="range"
        :min="min"
        :max="max"
        :step="1"
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
        :step="1"
        v-model.number="maxValue"
        @input="fixMax"
        @mousedown="onDragStart"
        @mouseup="onDragEnd"
        @touchstart="onDragStart"
        @touchend="onDragEnd"
      />
    </div>

    <div class="slider-marks bodyLight12px">
      <span>최소</span>
      <span>10평</span>
      <span>15평</span>
      <span>최대</span>
    </div>
    <!-- submit 방지 -->
    <button class="reset-btn bodyMedium14px" type="button" @click="reset">초기화</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

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
});

// 부모 양방향 바인딩 지원을 위해 update 이벤트 추가
const emit = defineEmits(['change', 'update:minValue', 'update:maxValue']);

const min = 5, max = 20;
const minGap = 1; // 최소 포인터와 최대 포인터 사이의 최소 간격

const minValue = ref(props.minValue !== null ? props.minValue : min);
const maxValue = ref(props.maxValue !== null ? props.maxValue : max);

const isDragging = ref(false);
let debounceTimer = null;

watch(
  () => props.minValue,
  (newVal) => {
    if (newVal !== null) minValue.value = newVal;
  }
);
watch(
  () => props.maxValue,
  (newVal) => {
    if (newVal !== null) maxValue.value = newVal;
  }
);

const leftLabel = computed(() => {
  return minValue.value === min
    ? '최소'
    : `${minValue.value}평 (${toM2(minValue.value)}㎡)`;
});
const rightLabel = computed(() => {
  return maxValue.value === max
    ? '최대'
    : `${maxValue.value}평 (${toM2(maxValue.value)}㎡)`;
});

const rangeStyle = computed(() => {
  const range = max - min;
  const leftPercent = ((minValue.value - min) / range) * 100;
  const rightPercent = ((max - maxValue.value) / range) * 100;

  return {
    left: `${leftPercent}%`,
    right: `${rightPercent}%`,
  };
});

function toM2(py) {
  return Math.round(py * 3.3);
}

function onDragStart() {
  isDragging.value = true;
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

function onDragEnd() {
  isDragging.value = false;
  emitChange();
}

function emitChange() {
  emit('update:minValue', minValue.value);
  emit('update:maxValue', maxValue.value);
  emit('change', { min: minValue.value, max: maxValue.value });
}

// 최소 값 포인터 보정
function fixMin() {
  if (maxValue.value - minValue.value < minGap) {
    minValue.value = maxValue.value - minGap;
  }
  if (!isDragging.value) emitChange();
}

// 최대 값 포인터 보정
function fixMax() {
  if (maxValue.value - minValue.value < minGap) {
    maxValue.value = minValue.value + minGap;
  }
  if (!isDragging.value) emitChange();
}

function reset() {
  minValue.value = min;
  maxValue.value = max;
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  emitChange(); // 부모/상단 라벨 즉시 갱신
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
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
</style>
