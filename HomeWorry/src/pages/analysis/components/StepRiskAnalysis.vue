<template>
  <div class="property-risk-check">
    <!-- 거래 유형 선택 컴포넌트 -->
    <InputSelect
      label="거래 유형"
      :options="dealTypeOptions"
      v-model="dealType"
      placeholder="거래 유형을 선택해주세요."
      desc="•입력한 거래가는 선택한 거래 유형(전세/월세/매매)을 기준으로 분석됩니다."
    />

    <!-- 월세 선택 시 보증금과 월세 입력 필드 노출 -->
    <div v-if="dealType === '월세'" class="risk-input-field-multiple">
      <!-- 보증금 입력 -->
      <div class="input-group">
        <label class="input-label bodyMedium20px">보증금</label>
        <input
          type="text"
          class="input-box bodyLight16px"
          placeholder="보증금을 입력해주세요."
          v-model="depositString"
          @input="onDepositInput"
          @focus="onDepositFocus"
        />
        <!-- 보증금이 0 이상일 경우 포맷된 금액 표시 -->
        <div v-if="depositValue > 0" class="formatted-price bodyLight12px">
          {{ formattedDeposit }}
        </div>
      </div>

      <!-- 월세 입력 -->
      <div class="input-group">
        <label class="input-label bodyMedium20px">월세</label>
        <input
          type="text"
          class="input-box bodyLight16px"
          placeholder="월세를 입력해주세요."
          v-model="monthlyRentString"
          @input="onMonthlyRentInput"
          @focus="onMonthlyRentFocus"
        />
        <!-- 월세가 0 이상일 경우 포맷된 금액 표시 -->
        <div v-if="monthlyRentValue > 0" class="formatted-price bodyLight12px">
          {{ formattedMonthlyRent }}
        </div>
      </div>

      <!-- 보증금, 월세에 더할 금액 버튼 그룹 -->
      <NumberButtonGroup
        :labels="buttonLabels"
        :amounts="buttonAmounts"
        @add="addAmount"
      />

      <!-- 월세 입력 시 안내 문구 -->
      <div class="input-desc bodyLight12px">
        • 입력한 보증금과 월세를 기반으로 주변 시세와 비교해 과도한 고가 거래
        또는 저가 거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
      </div>
    </div>

    <!-- 월세가 아닌 경우 단일 거래가 입력 필드 -->
    <div v-else class="risk-input-field">
      <label class="input-label bodyMedium20px">거래가</label>
      <input
        type="text"
        class="input-box bodyLight16px"
        :placeholder="dealPricePlaceholder"
        v-model="dealPriceString"
        @input="onDealPriceInput"
      />

      <!-- 거래가 0 이상일 때 포맷된 금액 표시 -->
      <div v-if="dealPrice > 0" class="formatted-price bodyLight12px">
        {{ formattedDealPrice }}
      </div>

      <!-- 거래가에 더할 금액 버튼 그룹 -->
      <NumberButtonGroup
        :labels="dealPriceButtonLabels"
        :amounts="dealPriceButtonAmounts"
        @add="addPrice"
      />

      <!-- 거래가 입력 시 안내 문구 -->
      <div class="input-desc bodyLight12px">
        • 입력한 거래가를 기반으로 주변 시세와 비교해 과도한 고가 거래 또는 저가
        거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
      </div>

      <!-- 거래가 입력 오류 메시지 -->
      <div v-if="priceError" class="input-error bodyLight12px">
        {{ priceError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import InputSelect from '@/components/input/InputSelect.vue';
import NumberButtonGroup from '@/components/input/NumberButtonGroup.vue';
import { useAnalysisStore } from '@/stores/analysis.js';
import { storeToRefs } from 'pinia';

// Pinia 스토어에서 리스크 분석 정보 가져오기
const analysisStore = useAnalysisStore();
const { sthRisk } = storeToRefs(analysisStore);

// 거래 유형 상태, 스토어 초기값으로 세팅
const dealType = ref(sthRisk.value.type);

// 거래가 숫자와 콤마 포함 문자열 상태 관리
const dealPrice = ref(Number(sthRisk.value.price) || 0);
const dealPriceString = ref(
  dealPrice.value > 0 ? dealPrice.value.toLocaleString() : ''
);

// 월세 입력을 위한 보증금 및 월세 상태와 포맷 문자열 관리
const depositValue = ref(0);
const depositString = ref('');
const monthlyRentValue = ref(0);
const monthlyRentString = ref('');

// 어떤 입력란에 포커스가 있는지 관리 (버튼 그룹 동작 제어용)
const focusedInput = ref(null);

// 거래 유형 선택 옵션
const dealTypeOptions = [
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
  { label: '매매', value: '매매' },
];

// 월세용 금액 버튼 라벨 및 값 배열 (보증금, 월세 공통)
const buttonLabels = computed(() => ['1만원', '10만원', '100만원', '1천만원']);
const buttonAmounts = computed(() => [10_000, 100_000, 1_000_000, 10_000_000]);

// 전세, 매매용 금액 버튼 라벨 및 값 배열
const dealPriceButtonLabels = ['100만원', '1천만원', '1억', '10억'];
const dealPriceButtonAmounts = [
  1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
];

// 숫자에 콤마를 추가하는 포맷 함수
function formatPrice(num) {
  return num.toLocaleString();
}

// 문자열에서 숫자만 추출하는 함수 (비숫자 문자 제거)
function extractNumber(str) {
  return Number(str.replace(/[^0-9]/g, '')) || 0;
}

// 거래가 입력 처리 및 스토어 값 동기화
function onDealPriceInput(e) {
  dealPriceString.value = e.target.value;
  dealPrice.value = extractNumber(dealPriceString.value);
  analysisStore.sthRisk.price = dealPrice.value;
}

// 보증금 입력 처리 및 합산 함수 호출
function onDepositInput(e) {
  depositString.value = e.target.value;
  depositValue.value = extractNumber(depositString.value);
  updateTotalMonthlyPrice();
}

// 월세 입력 처리 및 합산 함수 호출
function onMonthlyRentInput(e) {
  monthlyRentString.value = e.target.value;
  monthlyRentValue.value = extractNumber(monthlyRentString.value);
  updateTotalMonthlyPrice();
}

// 보증금과 월세 합산하여 스토어에 저장
function updateTotalMonthlyPrice() {
  analysisStore.sthRisk.price = depositValue.value + monthlyRentValue.value;
}

// 입력 포커스 상태 업데이트 (보증금/월세 구분용)
function onDepositFocus() {
  focusedInput.value = 'deposit';
}
function onMonthlyRentFocus() {
  focusedInput.value = 'monthlyRent';
}

// 거래가, 보증금, 월세 값이 변할 때 포맷된 문자열 자동 업데이트
watch(dealPrice, (val) => {
  dealPriceString.value = val > 0 ? formatPrice(val) : '';
});
watch(depositValue, (val) => {
  depositString.value = val > 0 ? formatPrice(val) : '';
});
watch(monthlyRentValue, (val) => {
  monthlyRentString.value = val > 0 ? formatPrice(val) : '';
});

// 거래 유형에 따른 거래가 입력 필드 placeholder 설정
const dealPricePlaceholder = computed(() => {
  switch (dealType.value) {
    case '전세':
      return '전세 거래가를 입력해주세요.';
    case '월세':
      return '예: 보증금 1000 월세 80';
    case '매매':
      return '매매 거래가를 입력해주세요.';
    default:
      return '거래가를 입력해주세요.';
  }
});

// 거래가 입력 시 거래 유형 미선택에 대한 오류 메시지 계산
const priceError = computed(() => {
  if (!dealType.value && dealPriceString.value.trim() !== '') {
    return '거래 유형을 먼저 선택해주세요.';
  }
  return '';
});

// 보증금 또는 월세 입력창에 자동 금액 더하기 (포커스 대상에 따라 분기)
function addAmount(amount) {
  if (focusedInput.value === 'deposit') {
    depositValue.value += amount;
  } else if (focusedInput.value === 'monthlyRent') {
    monthlyRentValue.value += amount;
  } else {
    depositValue.value += amount;
  }
}

// 거래가 입력창에 자동 금액 더하기
function addPrice(amount) {
  dealPrice.value += amount;
}

// 숫자를 한글 단위로 변환하는 함수 (예: 10000 -> 1만 원)
function numberToKoreanWon(num) {
  if (num === 0) return '0원';

  const units = [
    { value: 1_0000_0000, str: '억' },
    { value: 1_0000_000, str: '천만' },
    { value: 1_0000, str: '만' },
  ];

  let result = '';
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
    result = result.trim() + '원';
  }

  return result.trim();
}

// 전세, 매매 거래가에 대한 포맷된 금액 문자열 계산
const formattedDealPrice = computed(() => {
  if (dealType.value === '월세') {
    // 월세는 보증금/월세 별도로 표시하므로 빈 문자열 반환
    return '';
  }
  return numberToKoreanWon(dealPrice.value);
});

// 포맷된 보증금 문자열
const formattedDeposit = computed(() => numberToKoreanWon(depositValue.value));

// 포맷된 월세 문자열
const formattedMonthlyRent = computed(() =>
  numberToKoreanWon(monthlyRentValue.value)
);
</script>

<style scoped>
.property-risk-check {
  display: flex;
  flex-direction: column;
}

.input-label {
  color: var(--color-primary);
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
  margin-bottom: 8px;
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
</style>
