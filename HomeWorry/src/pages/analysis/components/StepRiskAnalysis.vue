<template>
  <div class="property-risk-check">
    <InputSelect
      label="거래 유형"
      :options="dealTypeOptions"
      v-model="dealType"
      placeholder="거래 유형을 선택해주세요."
      desc="•입력한 거래가는 선택한 거래 유형(전세/월세/매매)을 기준으로 분석됩니다."
    />

    <div v-if="dealType === '월세'" class="risk-input-field-multiple">
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
        <div v-if="depositValue > 0" class="formatted-price bodyLight12px">
          {{ formattedDeposit }}
        </div>
      </div>

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
        <div v-if="monthlyRentValue > 0" class="formatted-price bodyLight12px">
          {{ formattedMonthlyRent }}
        </div>
      </div>

      <NumberButtonGroup
        :labels="buttonLabels"
        :amounts="buttonAmounts"
        @add="addAmount"
      />

      <div class="input-desc bodyLight12px">
        • 입력한 보증금과 월세를 기반으로 주변 시세와 비교해 과도한 고가 거래
        또는 저가 거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
      </div>

      <div v-if="priceError" class="input-error bodyLight12px">
        {{ priceError }}
      </div>
    </div>

    <div v-else class="risk-input-field">
      <label class="input-label bodyMedium20px">거래가</label>
      <input
        type="text"
        class="input-box bodyLight16px"
        :placeholder="dealPricePlaceholder"
        v-model="dealPriceString"
        @input="onDealPriceInput"
      />

      <div v-if="dealPrice > 0" class="formatted-price bodyLight12px">
        {{ formattedDealPrice }}
      </div>

      <NumberButtonGroup
        :labels="dealPriceButtonLabels"
        :amounts="dealPriceButtonAmounts"
        @add="addPrice"
      />

      <div class="input-desc bodyLight12px">
        • 입력한 거래가를 기반으로 주변 시세와 비교해 과도한 고가 거래 또는 저가
        거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다.
      </div>

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

const analysisStore = useAnalysisStore();
const { sthRisk } = storeToRefs(analysisStore);

const dealType = ref(sthRisk.value.type);

const dealPrice = ref(Number(sthRisk.value.price) || 0);
const dealPriceString = ref(
  dealPrice.value > 0 ? dealPrice.value.toLocaleString() : ''
);

const depositValue = ref(0);
const depositString = ref('');

const monthlyRentValue = ref(0);
const monthlyRentString = ref('');

const focusedInput = ref(null);

const dealTypeOptions = [
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
  { label: '매매', value: '매매' },
];

const buttonLabels = computed(() => {
  if (focusedInput.value === 'deposit') {
    return ['1만원', '10만원', '100만원', '1천만원'];
  }
  if (focusedInput.value === 'monthlyRent') {
    return ['1만원', '10만원', '100만원', '1천만원'];
  }
  return ['1만원', '10만원', '100만원', '1천만원'];
});

const buttonAmounts = computed(() => {
  if (focusedInput.value === 'deposit') {
    return [10_000, 100_000, 1_000_000, 10_000_000];
  }
  if (focusedInput.value === 'monthlyRent') {
    return [10_000, 100_000, 1_000_000, 10_000_000];
  }
  return [10_000, 100_000, 1_000_000, 10_000_000];
});

const dealPriceButtonLabels = ['100만원', '1천만원', '1억', '10억'];
const dealPriceButtonAmounts = [
  1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
];

function formatPrice(num) {
  return num.toLocaleString();
}

function extractNumber(str) {
  return Number(str.replace(/[^0-9]/g, '')) || 0;
}

function onDealPriceInput(e) {
  dealPriceString.value = e.target.value;
  dealPrice.value = extractNumber(dealPriceString.value);
  analysisStore.sthRisk.price = dealPrice.value;
}

function onDepositInput(e) {
  depositString.value = e.target.value;
  depositValue.value = extractNumber(depositString.value);
  updateTotalMonthlyPrice();
}

function onMonthlyRentInput(e) {
  monthlyRentString.value = e.target.value;
  monthlyRentValue.value = extractNumber(monthlyRentString.value);
  updateTotalMonthlyPrice();
}

function updateTotalMonthlyPrice() {
  analysisStore.sthRisk.price = depositValue.value + monthlyRentValue.value;
}

function onDepositFocus() {
  focusedInput.value = 'deposit';
}

function onMonthlyRentFocus() {
  focusedInput.value = 'monthlyRent';
}

watch(dealPrice, (val) => {
  dealPriceString.value = val > 0 ? formatPrice(val) : '';
});

watch(depositValue, (val) => {
  depositString.value = val > 0 ? formatPrice(val) : '';
});

watch(monthlyRentValue, (val) => {
  monthlyRentString.value = val > 0 ? formatPrice(val) : '';
});

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

const priceError = computed(() => {
  if (
    !dealType.value &&
    (dealPriceString.value.trim() !== '' ||
      depositString.value.trim() !== '' ||
      monthlyRentString.value.trim() !== '')
  ) {
    return '거래 유형을 먼저 선택해주세요.';
  }
  return '';
});

function addAmount(amount) {
  if (focusedInput.value === 'deposit') {
    depositValue.value += amount;
  } else if (focusedInput.value === 'monthlyRent') {
    monthlyRentValue.value += amount;
  } else {
    depositValue.value += amount;
  }
}

function addPrice(amount) {
  dealPrice.value += amount;
}

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

const formattedDealPrice = computed(() => {
  if (dealType.value === '월세') {
    return `보증금: ${numberToKoreanWon(
      depositValue.value
    )}, 월세: ${numberToKoreanWon(monthlyRentValue.value)}`;
  }
  return numberToKoreanWon(dealPrice.value);
});

const formattedDeposit = computed(() => numberToKoreanWon(depositValue.value));
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
