<template>
  <div>
    <div class="search-bar bodyMedium14px">
      <FilterButton
        :text="selectedLabel"
        @click="openSheet('transaction')"
      />
      <FilterButton
        :text="areaLabel"
        @click="openSheet('area')"
      />
    </div>

    <BottomSheet :visible="sheetOpen" @close="sheetOpen = false">
      <template #title>
        <div class="sheet-title-row bodyMedium14px">
          <span>
            {{ sheetType === 'transaction' ? '거래유형' : '평수' }}
          </span>
          <!-- 평수일 때만 오른쪽 상단에 확인 버튼 -->
          <button
            v-if="sheetType === 'area'"
            class="apply-btn top"
            @click="applyArea"
          >
            확인
          </button>
        </div>
      </template>
      <!-- 거래유형: FilterOptionList 적용 (복수 선택 가능) -->
      <template v-if="sheetType === 'transaction'">
        <FilterOptionList
          :options="transactionTypes.map(t => t.label)"
          :modelValue="tempTransactionTypeLabels"
          @update:modelValue="onTransactionTypeChange"
        />
        <div class="btn-row">
          <button class="reset-btn bodyMedium14px" @click="resetTransaction">초기화</button>
          <button class="apply-btn bodyMedium14px" @click="applyTransaction">확인</button>
        </div>
      </template>
      <!-- 평수 -->
      <template v-if="sheetType === 'area'">
        <AreaSlider
          :minValue="tempMinPyeong"
          :maxValue="tempMaxPyeong"
          @change="({ min, max }) => { tempMinPyeong = min; tempMaxPyeong = max; }"
        />
      </template>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FilterButton from '@/pages/map/components/FilterButton.vue'
import BottomSheet from '@/pages/map/components/BottomSheet.vue'
import AreaSlider from '@/pages/map/components/AreaSlider.vue'
import FilterOptionList from '@/pages/map/components/FilterOptionList.vue'

// 거래유형 옵션
const transactionTypes = [
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
  { label: '단기임대', value: '단기임대' },
]

const props = defineProps({
  minPyeong: Number,
  maxPyeong: Number,
  selectedTransactionType: Array, // 여러개 선택 가능
})
const emit = defineEmits(['update:transactionType', 'update:minPyeong', 'update:maxPyeong'])

// 내부 임시 상태 (확인 전까지는 부모에 영향 안줌)
const tempTransactionTypes = ref(props.selectedTransactionType ? [...props.selectedTransactionType] : []);
const tempMinPyeong = ref(props.minPyeong ?? null)
const tempMaxPyeong = ref(props.maxPyeong ?? null)

// 거래유형 라벨 목록 (ex: ['전세', '월세'])
const tempTransactionTypeLabels = computed(() =>
  tempTransactionTypes.value
    .map(v => transactionTypes.find(t => t.value === v)?.label)
    .filter(Boolean)
);

// props 값이 변경될 때 임시값도 동기화
watch(() => props.selectedTransactionType, val => {
  tempTransactionTypes.value = val ? [...val] : []
})
watch(() => props.minPyeong, val => { tempMinPyeong.value = val })
watch(() => props.maxPyeong, val => { tempMaxPyeong.value = val })

const sheetOpen = ref(false)
const sheetType = ref('transaction')

// 거래유형 FilterOptionList에서 옵션 변경시
function onTransactionTypeChange(val) {
  // val: ['전세', '월세', ...]
  tempTransactionTypes.value = val
}

// "확인" 눌렀을 때 상위로 emit
function applyTransaction() {
  emit('update:transactionType', [...tempTransactionTypes.value])
  sheetOpen.value = false
}
function resetTransaction() {
  tempTransactionTypes.value = []
  emit('update:transactionType', [])
}

// 평수 처리
function applyArea() {
  emit('update:minPyeong', tempMinPyeong.value)
  emit('update:maxPyeong', tempMaxPyeong.value)
  sheetOpen.value = false
}

// FilterButton에 보여줄 거래유형 라벨
const selectedLabel = computed(() => {
  if (!props.selectedTransactionType || props.selectedTransactionType.length === 0) return '거래유형';
  return props.selectedTransactionType
    .map(v => transactionTypes.find(t => t.value === v)?.label)
    .filter(Boolean)
    .join(', ')
});
const areaLabel = computed(() =>
  (props.minPyeong || props.maxPyeong)
    ? `${props.minPyeong ?? ''}${props.minPyeong ? '평' : ''}` +
      ((props.minPyeong || props.maxPyeong) ? ' ~ ' : '') +
      `${props.maxPyeong ?? ''}${props.maxPyeong ? '평' : ''}`
    : '평수'
)

function openSheet(type) {
  sheetType.value = type
  sheetOpen.value = true
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  gap: 10px;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-lightgray);
  background: var(--color-white);
}
.btn-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}
.sheet-title-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.apply-btn {
  min-width: 50px;
  height: 25px;
  /* padding: 5px 14px; */
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: var(--color-primary);
  color: var(--color-white);
}

.apply-btn.top {
  margin-right: -8px;
  margin-top: -3px;
}

.reset-btn {
  background: var(--color-lightgray);
  color: var(--color-black);
  min-width: 72px;
  padding: 8px 0;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}
</style>
