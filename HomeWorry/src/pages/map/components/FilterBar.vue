<template>
  <div>
    <div class="search-bar bodyMedium14px">
      <LocationSearch class="search-input-left" @search="onSearch" />
      <FilterButton :text="selectedLabel" @click="openSheet('transaction')" />
      <FilterButton :text="areaLabel" @click="openSheet('area')" />
    </div>

    <BottomSheet :visible="props.sheetOpen" @close="closeSheet">
      <template #title>
        <div class="sheet-title-row titleBold16px">
          <span>{{ sheetType === "transaction" ? "거래유형" : "평수" }}</span>
          <div class="action-btns">
            <button
              class="reset-btn-title bodyMedium12px"
              @click="sheetType === 'area' ? resetArea() : resetTransaction()"
              v-if="sheetType === 'transaction' || sheetType === 'area'"
            >
              <img :src="resetIcon" class="reset-icon" alt="초기화" />
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

      <!-- 거래유형 -->
      <template v-if="sheetType === 'transaction'">
        <FilterOptionList
          :options="transactionTypes.map((t) => t.label)"
          :modelValue="tempTransactionTypeLabels"
          @update:modelValue="onTransactionTypeChange"
        />
      </template>

      <!-- 평수 -->
      <template v-if="sheetType === 'area'">
        <AreaSlider
          :key="`${tempMinPyeong}-${tempMaxPyeong}`"
          :minValue="tempMinPyeong"
          :maxValue="tempMaxPyeong"
          @update:minValue="val => (tempMinPyeong = val)"
          @update:maxValue="val => (tempMaxPyeong = val)"
          @change="({ min, max }) => { tempMinPyeong = min; tempMaxPyeong = max; }"
        />
      </template>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import FilterButton from "@/pages/map/components/FilterButton.vue";
import BottomSheet from "@/pages/map/components/BottomSheet.vue";
import AreaSlider from "@/pages/map/components/AreaSlider.vue";
import FilterOptionList from "@/pages/map/components/FilterOptionList.vue";
import LocationSearch from "@/components/input/SearchInput.vue";
import resetIcon from "@/assets/icons/reset_circle.png";

// 거래유형 옵션
const transactionTypes = [
  { label: "전세", value: "전세" },
  { label: "월세", value: "월세" },
  { label: "단기임대", value: "단기임대" },
];

const props = defineProps({
  minPyeong: Number,
  maxPyeong: Number,
  selectedTransactionType: Array, // 여러개 선택 가능
  sheetOpen: Boolean,
});

const emit = defineEmits([
  "update:transactionType",
  "update:minPyeong",
  "update:maxPyeong",
  "update:sheetOpen",
  "search",
]);

const AREA_MIN = 5;
const AREA_MAX = 20;

// 내부 임시 상태 (확인 전까지는 부모에 영향 안줌)
const tempTransactionTypes = ref(
  props.selectedTransactionType ? [...props.selectedTransactionType] : []
);
const tempMinPyeong = ref(props.minPyeong ?? AREA_MIN);
const tempMaxPyeong = ref(props.maxPyeong ?? AREA_MAX);

// 거래유형 라벨 목록 (ex: ['전세', '월세'])
const tempTransactionTypeLabels = computed(() =>
  tempTransactionTypes.value
    .map((v) => transactionTypes.find((t) => t.value === v)?.label)
    .filter(Boolean)
);

// props 변경 시 임시값 동기화
watch(
  () => props.selectedTransactionType,
  (val) => {
    tempTransactionTypes.value = val ? [...val] : [];
  }
);
watch(
  () => props.minPyeong,
  (val) => {
    tempMinPyeong.value = val ?? AREA_MIN;
  }
);
watch(
  () => props.maxPyeong,
  (val) => {
    tempMaxPyeong.value = val ?? AREA_MAX;
  }
);

const sheetType = ref("transaction");

// 거래유형 변경 수신
function onTransactionTypeChange(val) {
  // val: ['전세','월세',...]
  tempTransactionTypes.value = val;
}

// 거래유형 적용/초기화
function applyTransaction() {
  emit("update:transactionType", [...tempTransactionTypes.value]);
  emit("update:sheetOpen", false);
}
function resetTransaction() {
  tempTransactionTypes.value = [];
  emit("update:transactionType", []); // 즉시 반영
}

// 평수 적용/초기화
function applyArea() {
  emit("update:minPyeong", tempMinPyeong.value);
  emit("update:maxPyeong", tempMaxPyeong.value);
  emit("update:sheetOpen", false);
}
function resetArea() {
  // 슬라이더는 전체 범위로 복귀
  tempMinPyeong.value = AREA_MIN;
  tempMaxPyeong.value = AREA_MAX;
  // 부모 필터는 해제(null)
  emit("update:minPyeong", null);
  emit("update:maxPyeong", null);
}

// 거래유형 버튼 라벨
const selectedLabel = computed(() => {
  if (!props.selectedTransactionType || props.selectedTransactionType.length === 0)
    return "거래유형";
  return props.selectedTransactionType
    .map((v) => transactionTypes.find((t) => t.value === v)?.label)
    .filter(Boolean)
    .join(", ");
});

const areaLabel = computed(() => {
  const min = props.minPyeong ?? AREA_MIN;
  const max = props.maxPyeong ?? AREA_MAX;

  const isMinDefault = props.minPyeong == null || props.minPyeong === AREA_MIN;
  const isMaxDefault = props.maxPyeong == null || props.maxPyeong === AREA_MAX;

  if (isMinDefault && isMaxDefault) return "전체";

  const left = isMinDefault ? "최소" : `${min}평`;
  const right = isMaxDefault ? "최대" : `${max}평`;

  return `${left} ~ ${right}`;
});

function openSheet(type) {
  sheetType.value = type;
  emit("update:sheetOpen", true);
}
function closeSheet() {
  emit("update:sheetOpen", false);
}

function onSearch(keyword) {
  emit("search", keyword);
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
