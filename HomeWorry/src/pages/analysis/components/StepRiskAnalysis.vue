<template>
  <div class="property-risk-check">
    <!-- 거래 유형 선택 컴포넌트 -->
    <div class="label-row">
      <label class="input-label bodyMedium20px">거래 유형</label>
      <HelpButton :message="typeMessage" />
    </div>
    <InputSelect
      :options="dealTypeOptions"
      v-model="dealType"
      placeholder="거래 유형을 선택해주세요."
      desc="•입력한 거래가는 선택한 거래 유형(전세/월세/매매)을 기준으로 분석됩니다."
    />
  </div>

  <!-- 월세일 때 보증금(price) + 월세(monthlyPrice) 입력 -->

  <div v-if="dealType === '월세'" class="risk-input-field-multiple">
    <div class="input-group">
      <div class="label-row">
        <label class="input-label bodyMedium20px">보증금</label>
        <HelpButton :message="depositMessage" />
      </div>
      <input
        type="text"
        class="input-box bodyLight16px"
        placeholder="보증금을 입력해주세요."
        v-model="priceString"
        @input="onPriceInput"
        @focus="onPriceFocus"
      />
      <div v-if="priceValue > 0" class="formatted-price bodyLight12px">
        {{ formattedPrice }}
      </div>
    </div>

    <div class="input-group">
      <div class="label-row">
        <label class="input-label bodyMedium20px">월세</label>
        <HelpButton :message="monthlyPriceMessage" />
      </div>
      <input
        type="text"
        class="input-box bodyLight16px"
        placeholder="월세를 입력해주세요."
        v-model="monthlyPriceString"
        @input="onMonthlyPriceInput"
        @focus="onMonthlyPriceFocus"
      />
      <div v-if="monthlyPriceValue > 0" class="formatted-price bodyLight12px">
        {{ formattedMonthlyPrice }}
      </div>
    </div>

    <NumberButtonGroup
      :labels="buttonLabels"
      :amounts="buttonAmounts"
      @add="addAmount"
    />

    <div class="input-desc bodyLight12px">
      * 입력한 보증금과 월세를 기반으로 주변 시세와 비교해 과도한 고가 거래 또는
      저가 거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
    </div>
  </div>

  <!-- 월세가 아닐 때 (전세, 매매) 거래가(price) 입력 -->
  <div v-else class="risk-input-field">
    <div class="label-row">
      <label class="input-label bodyMedium20px">거래가</label>
      <HelpButton :message="dealPriceMessage" />
    </div>
    <input
      type="text"
      class="input-box bodyLight16px"
      :placeholder="dealPricePlaceholder"
      v-model="priceString"
      @input="onPriceInput"
      @focus="onPriceFocus"
    />
    <div v-if="priceValue > 0" class="formatted-price bodyLight12px">
      {{ formattedPrice }}
    </div>

    <NumberButtonGroup
      :labels="dealPriceButtonLabels"
      :amounts="dealPriceButtonAmounts"
      @add="addPrice"
    />

    <div class="input-desc bodyLight12px">
      * 입력한 거래가를 기반으로 주변 시세와 비교해 과도한 고가 거래 또는 저가
      거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
    </div>

    <div v-if="priceError" class="input-error bodyLight12px">
      {{ priceError }}
    </div>
  </div>

  <!-- 실평수 -->
  <div class="input-group" style="margin-top: 24px">
    <div class="label-row">
      <label class="input-label bodyMedium20px">실평수</label>
      <HelpButton :message="sizeMessage" />
    </div>
    <input
      type="number"
      class="input-box bodyLight16px"
      placeholder="실평수를 입력해주세요."
      v-model="areaString"
      @input="onAreaInput"
    />
    <div class="input-desc bodyLight12px">
      * 해당 매물의 실평수(평)를 입력해주세요. 입력하신 평수는 시스템에서
      제곱미터(㎡) 단위로 변환되어 리스크 분석과 시세 비교에 활용됩니다.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import InputSelect from "@/components/input/InputSelect.vue";
import NumberButtonGroup from "@/components/input/NumberButtonGroup.vue";
import { useAnalysisStore } from "@/stores/analysis.js";
import { storeToRefs } from "pinia";
import HelpButton from "@/components/input/HelpButton.vue";

const analysisStore = useAnalysisStore();
const { sthRisk } = storeToRefs(analysisStore);

const dealType = ref(sthRisk.value.type);

const typeMessage = ref(
  "월세, 전세, 매매를 입력 받고 해당 동네, 평수의 매물 평균 시세와 비교해줍니다."
);
const depositMessage = ref("보증금을 입력받아 리스크 분석에 활용합니다.");
const monthlyPriceMessage = ref("월세를 입력받아 리스크 분석에 활용합니다.");
const dealPriceMessage = ref("거래가를 입력받아 리스크 분석에 활용합니다.");
const sizeMessage = ref(
  "매물의 실평수를 입력받아 비슷한 평수의 매물의 가격과의 차이를 비교합니다."
);

const priceValue = ref(Number(sthRisk.value.price) || 0);
const priceString = ref(
  priceValue.value > 0 ? priceValue.value.toLocaleString() : ""
);

const monthlyPriceValue = ref(Number(sthRisk.value.monthlyPrice) || 0);
const monthlyPriceString = ref(
  monthlyPriceValue.value > 0 ? monthlyPriceValue.value.toLocaleString() : ""
);

const areaValue = ref(Number(sthRisk.value.size) || 0);
const areaString = ref(areaValue.value > 0 ? areaValue.value.toString() : "");

const focusedInput = ref(null);

const dealTypeOptions = [
  { label: "전세", value: "전세" },
  { label: "월세", value: "월세" },
  { label: "매매", value: "매매" },
];

const buttonLabels = computed(() => ["1만원", "10만원", "100만원", "1천만원"]);
const buttonAmounts = computed(() => [10_000, 100_000, 1_000_000, 10_000_000]);

const dealPriceButtonLabels = ["100만원", "1천만원", "1억", "10억"];
const dealPriceButtonAmounts = [
  1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
];

const dealPricePlaceholder = computed(() => {
  switch (dealType.value) {
    case "전세":
      return "전세 거래가를 입력해주세요.";
    case "월세":
      return "예: 보증금 1000 월세 80";
    case "매매":
      return "매매 거래가를 입력해주세요.";
    default:
      return "거래가를 입력해주세요.";
  }
});

// 숫자 포맷 함수
function formatPrice(num) {
  return num.toLocaleString();
}

// 숫자만 추출 함수
function extractNumber(str) {
  return Number(str.replace(/[^0-9]/g, "")) || 0;
}

// 거래가 (price) 입력 처리
function onPriceInput(e) {
  priceString.value = e.target.value;
  priceValue.value = extractNumber(priceString.value);

  if (dealType.value !== "월세") {
    // 월세가 아닐 때 월세 값 초기화
    monthlyPriceValue.value = 0;
    monthlyPriceString.value = "";
  }
}

// 월세 입력 처리
function onMonthlyPriceInput(e) {
  monthlyPriceString.value = e.target.value;
  monthlyPriceValue.value = extractNumber(monthlyPriceString.value);
}

// 평수 입력 처리
function onAreaInput(e) {
  areaString.value = e.target.value;
  areaValue.value = extractNumber(areaString.value);
  // 평수를 제곱미터로 변환해서 저장
  sthRisk.value.size = areaValue.value * 3;
}

// 포커스 관리
function onPriceFocus() {
  focusedInput.value = "price";
}
function onMonthlyPriceFocus() {
  focusedInput.value = "monthlyPrice";
}

// 가격 값 변경 시 스토어 동기화 및 문자열 포맷 업데이트
watch(priceValue, (val) => {
  sthRisk.value.price = val;
  priceString.value = val > 0 ? formatPrice(val) : "";
});

watch(monthlyPriceValue, (val) => {
  sthRisk.value.monthlyPrice = val;
  monthlyPriceString.value = val > 0 ? formatPrice(val) : "";
});

watch(areaValue, (val) => {
  areaString.value = val > 0 ? val.toString() : "";
});

// 거래 유형 변경 시 스토어 동기화 및 price, monthlyPrice 초기화
watch(dealType, (newType) => {
  sthRisk.value.type = newType;

  // 거래유형 바뀌면 price 초기화
  priceValue.value = 0;
  priceString.value = "";
  sthRisk.value.price = 0;

  if (newType !== "월세") {
    monthlyPriceValue.value = 0;
    monthlyPriceString.value = "";
    sthRisk.value.monthlyPrice = 0;
  }
});

// 오류 메시지 계산
const priceError = computed(() => {
  if (!dealType.value && priceString.value.trim() !== "") {
    return "거래 유형을 먼저 선택해주세요.";
  }
  return "";
});

// 버튼 그룹 금액 더하기
function addAmount(amount) {
  if (focusedInput.value === "monthlyPrice") {
    monthlyPriceValue.value += amount;
  } else {
    priceValue.value += amount;
  }
}

function addPrice(amount) {
  priceValue.value += amount;
}

// 한글 단위 변환 함수
function numberToKoreanWon(num) {
  if (num === 0) return "0원";

  const units = [
    { value: 1_0000_0000, str: "억" },
    { value: 1_0000_000, str: "천만" },
    { value: 1_0000, str: "만" },
  ];

  let result = "";
  let remainder = num;

  for (const unit of units) {
    if (remainder >= unit.value) {
      const count = Math.floor(remainder / unit.value);
      remainder %= unit.value;
      result += `${count}${unit.str} `;
    }
  }

  if (remainder > 0) {
    result += `${remainder.toLocaleString()}원`;
  } else {
    result = result.trim() + "원";
  }

  return result.trim();
}

const formattedPrice = computed(() => numberToKoreanWon(priceValue.value));

const formattedMonthlyPrice = computed(() =>
  numberToKoreanWon(monthlyPriceValue.value)
);
</script>

<style scoped>
.property-risk-check {
  display: flex;
  flex-direction: column;
}

.risk-input-field,
.risk-input-field-multiple {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.risk-input-field-multiple > .input-group:nth-child(2) {
  margin-top: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-box {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 1px solid var(--color-light);
  border-radius: 12px;
  box-sizing: border-box;
  outline: none;
  transition: border 0.2s;
  color: var(--color-text);
}

.input-box:focus {
  border-color: var(--color-primary);
}

.input-box::placeholder {
  color: var(--color-mediumgray);
}

.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
}

.input-error {
  color: #bf0000;
  margin-top: 4px;
}

.label-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.input-label {
  margin-bottom: -4px;
  display: block;
  color: var(--color-primary);
}
</style>
