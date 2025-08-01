<template>
  <div>
    <div class="search-bar">
      <button class="reset-btn bodyMedium14px" @click="reset">초기화</button>
      <!-- 거래유형 필터 버튼 -->
      <div class="transaction-type-group">
        <button
          v-for="type in transactionTypes"
          :key="type.value"
          :class="['transaction-type-btn', { selected: props.selectedTransactionType === type.value }]"
          @click="selectTransactionType(type.value)"
        >
          {{ type.label }}
        </button>
      </div>
      <!-- AreaSlider is always visible here -->
      <AreaSlider
        :minValue="props.minPyeong"
        :maxValue="props.maxPyeong"
        @change="onAreaChange"
      />
    </div>
  </div>
</template>

<script setup>
import AreaSlider from '../components/AreaSlider.vue'

const props = defineProps({
  minPyeong: {
    type: Number,
    default: null,
  },
  maxPyeong: {
    type: Number,
    default: null,
  },
  selectedTransactionType: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['updatePyeong', 'updateTransactionType'])

const transactionTypes = [
  { label: '전체', value: '' },
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
  { label: '단기임대', value: '단기임대' },
]

function selectTransactionType(type) {
  emit('updateTransactionType', type)
}

function onAreaChange(areaData) {
  emit('updatePyeong', {
    min: areaData.min,
    max: areaData.max,
  })
}

function reset() {
  emit('updatePyeong', {
    min: null,
    max: null,
  })
  emit('updateTransactionType', '')
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 8px;
  padding: 0 8px;
  border-top: 1px solid var(--color-lightgray);
  border-bottom: 1px solid var(--color-lightgray);
}
.transaction-type-group {
  display: flex;
  gap: 4px;
}
.transaction-type-btn {
  padding: 4px 12px;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  background: white;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
}
.transaction-type-btn.selected {
  background: var(--color-primary);
  color: white;
}
</style>
