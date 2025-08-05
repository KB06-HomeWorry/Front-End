<template>
  <div>
    <div class="search-bar bodyMedium14px">
      <LocationSearch class="search-input-left" @search="onSearch" />
      <FilterButton
        :text="selectedLabel"
        @click="openSheet('transaction')"
      />
      <FilterButton
        :text="areaLabel"
        @click="openSheet('area')"
      />
    </div>

    <BottomSheet :visible="props.sheetOpen" @close="closeSheet">
      <template #title>
        <div class="sheet-title-row titleBold16px">
          <span>
            {{ sheetType === 'transaction' ? '거래유형' : '평수' }}
          </span>
          <div class="action-btns">
            <button
              class="reset-btn-title bodyMedium12px"
              @click="resetTransaction"
              v-if="sheetType === 'transaction' || sheetType === 'area'"
            >
              <img src="@/assets/icons/reset_circle.png" class="reset-icon" alt="초기화" />
              초기화
            </button>
            <button
              class="apply-btn top bodyMedium12px"
              @click="sheetType === 'area' ? applyArea() : applyTransaction()"
            >
              확인
            </button>
          </div>
        </div>
      </template>
      <!-- 거래유형: FilterOptionList 적용 (복수 선택 가능) -->
      <template v-if="sheetType === 'transaction'">
        <FilterOptionList
          :options="transactionTypes.map(t => t.label)"
          :modelValue="tempTransactionTypeLabels"
          @update:modelValue="onTransactionTypeChange"
        />
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
import LocationSearch from '@/pages/map/components/LocationSearch.vue'

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
  sheetOpen: Boolean,
})
const emit = defineEmits([
  'update:transactionType',
  'update:minPyeong',
  'update:maxPyeong',
  'update:sheetOpen'
])

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

const sheetType = ref('transaction')

// 거래유형 FilterOptionList에서 옵션 변경시
function onTransactionTypeChange(val) {
  // val: ['전세', '월세', ...]
  tempTransactionTypes.value = val
}

// "확인" 눌렀을 때 상위로 emit
function applyTransaction() {
  emit('update:transactionType', [...tempTransactionTypes.value])
  emit('update:sheetOpen', false) // 시트 닫기
}
function resetTransaction() {
  tempTransactionTypes.value = []
  emit('update:transactionType', [])
}

// 평수 처리
function applyArea() {
  emit('update:minPyeong', tempMinPyeong.value)
  emit('update:maxPyeong', tempMaxPyeong.value)
  emit('update:sheetOpen', false) // 시트 닫기
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
  emit('update:sheetOpen', true)
}
function closeSheet() {
  emit('update:sheetOpen', false)
}
</script>

<style scoped>
.search-bar {
  width: 393px;
  display: flex;
  align-items: center;
  height: 50px;
  gap: 8px;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-lightgray);
  background: var(--color-white);
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
  margin-right: -3px;
  margin-top: -1px;
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

.sheet-title-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reset-btn-title {
  border: none;
  background: none;
  color: var(--color-mediumgray);
  display: flex;
  align-items: center;
  padding: 0 8px 0 0;
  cursor: pointer;
}

.reset-icon {
  width: 12px;
  height: 12px;
  margin-right: 3px;
  margin-bottom: 3px;
  vertical-align: middle;
}
</style>
