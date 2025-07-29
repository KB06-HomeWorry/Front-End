<template>
  <div class="commission-calculator">
    <!-- 거래 종류 선택 -->
    <div class="form-group bodyMedium16px">
      <InputSelect
        label="거래 종류"
        :options="transactionOptions"
        v-model="transactionType"
        placeholder="거래 종류를 선택해주세요."
      />
    </div>

    <!-- 물건 종류 선택 -->
    <div class="form-group bodyMedium16px">
      <InputSelect
        label="물건 종류"
        :options="propertyOptions"
        v-model="propertyType"
        placeholder="물건 종류를 선택해주세요."
      />
    </div>

    <!-- 매매/전세 (단일 가격 입력) -->
    <div v-if="transactionType !== 'monthlyRent'" class="form-group bodyMedium16px">
      <label>{{ transactionType === 'sale' ? '매매가' : '보증금' }}</label>
      <div class="input-with-unit">
        <input
          type="text"
          class="input-box"
          :placeholder="transactionType === 'sale' ? '예: 50000 (만원)' : '예: 30000 (만원)'"
          v-model="priceString"
          @input="onPriceInput"
          @focus="focusedInput = 'price'"
        />
      </div>
      <NumberButtonGroup
        :labels="['100만원', '1천만원', '1억', '10억']"
        :amounts="[100, 1000, 10000, 100000]"
        @add="addPrice"
      />
      <div v-if="priceValue > 0" class="formatted-price bodyLight12px">
        {{ formattedPrice }}
      </div>
    </div>

    <!-- 월세: 보증금+월세 입력 -->
    <div v-else class="form-group bodyMedium16px">
      <label>보증금</label>
      <div class="input-with-unit">
        <input
          type="text"
          class="input-box"
          placeholder="예: 1000 (만원)"
          v-model="priceString"
          @input="onPriceInput"
          @focus="focusedInput = 'price'"
        />
      </div>
      <NumberButtonGroup
        :labels="['10만원', '100만원', '1천만원', '1억']"
        :amounts="[10, 100, 1000, 10000]"
        @add="addPrice"
      />
      <div v-if="priceValue > 0" class="formatted-price bodyLight12px">
        {{ formattedPrice }}
      </div>

      <label style="margin-top:16px;">월세</label>
      <div class="input-with-unit">
        <input
          type="text"
          class="input-box"
          placeholder="예: 50 (만원)"
          v-model="monthlyRentString"
          @input="onMonthlyRentInput"
          @focus="focusedInput = 'monthlyRent'"
        />
      </div>
      <NumberButtonGroup
        :labels="['1만원', '10만원', '100만원', '1천만원']"
        :amounts="[1, 10, 100, 1000]"
        @add="addMonthlyRent"
      />
      <div v-if="monthlyRentValue > 0" class="formatted-price bodyLight12px">
        {{ formattedMonthlyPrice }}
      </div>
    </div>

    <BtnMedSlim @click="calculateCommission" class="calc-button" text="계산하기" />

    <div v-if="result.commission !== null" class="result-container">
      <div class="result-item">
        <span class="label bodyMedium14px">적용 거래가액</span>
        <span class="value titleBold16px">{{ formatCurrency(result.transactionAmount) }}원</span>
      </div>
      <div class="result-item">
        <span class="label bodyMedium14px">상한 요율</span>
        <span class="value titleBold16px">{{ result.rate * 100 }}%</span>
      </div>
      <div v-if="result.limit" class="result-item">
        <span class="label bodyMedium14px">한도액</span>
        <span class="value titleBold16px">{{ formatCurrency(result.limit) }}원</span>
      </div>
      <hr />
      <div class="result-item final-commission">
        <span class="label bodyMedium14px">최대 중개보수 (VAT 별도)</span>
        <span class="value titleBold16px">{{ formatCurrency(result.commission) }}원</span>
      </div>
      <div class="result-item total-amount">
        <span class="label bodyMedium14px">청구 예상 금액 (VAT 포함)</span>
        <span class="value titleBold16px">{{ formatCurrency(Math.floor(result.commission * 1.1)) }}원</span>
      </div>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import OptionBtnSmall from '@/pages/home/components/OptionBtnSmall.vue'; // 혹시 필요하면 유지
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';
import NumberButtonGroup from '@/components/input/NumberButtonGroup.vue';
import InputSelect from '@/components/input/InputSelect.vue';

// 상태 관리
const propertyType = ref('housing');
const transactionType = ref('sale');
const focusedInput = ref('price');

// 금액 입력값 (string), 실제 값 (number)
const priceString = ref('');
const priceValue = ref(0);
const monthlyRentString = ref('');
const monthlyRentValue = ref(0);

// 결과, 에러
const result = reactive({
  commission: null,
  transactionAmount: null,
  rate: null,
  limit: null,
});
const error = ref('');

// 옵션
const transactionOptions = [
  { label: '매매', value: 'sale' },
  { label: '전세', value: 'lease' },
  { label: '월세', value: 'monthlyRent' }
];
const propertyOptions = [
  { label: '주택', value: 'housing' },
  { label: '오피스텔', value: 'officetel' },
  { label: '기타', value: 'other' }
];

// 입력값 처리 함수
function onPriceInput(e) {
  priceString.value = e.target.value;
  priceValue.value = Number(priceString.value.replace(/[^0-9]/g, '')) || 0;
}
function onMonthlyRentInput(e) {
  monthlyRentString.value = e.target.value;
  monthlyRentValue.value = Number(monthlyRentString.value.replace(/[^0-9]/g, '')) || 0;
}

// 금액 버튼 누르면 현재 포커스된 input에 누적
function addPrice(amount) {
  priceValue.value += amount;
  priceString.value = priceValue.value.toString();
}
function addMonthlyRent(amount) {
  monthlyRentValue.value += amount;
  monthlyRentString.value = monthlyRentValue.value.toString();
}

// 한글 단위 변환 (만원 단위 입력)
function numberToKoreanWon(num) {
  if (!num) return '0원';
  const units = [
    { value: 100000000, str: '억' },
    { value: 10000, str: '만' }
  ];
  let result = '', n = num * 10000;
  for (const u of units) {
    if (n >= u.value) {
      result += `${Math.floor(n / u.value)}${u.str} `;
      n %= u.value;
    }
  }
  if (n > 0) result += `${n.toLocaleString()}원`;
  else result = result.trim() + '원';
  return result.trim();
}
const formattedPrice = computed(() => numberToKoreanWon(priceValue.value));
const formattedMonthlyPrice = computed(() => numberToKoreanWon(monthlyRentValue.value));

// 계산
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('ko-KR');
};

function calculateCommission() {
  result.commission = null;
  error.value = '';

  // validation
  if (!priceValue.value || priceValue.value <= 0) {
    error.value = "금액을 입력해주세요.";
    return;
  }
  if (transactionType.value === 'monthlyRent' && (!monthlyRentValue.value || monthlyRentValue.value < 0)) {
    error.value = "월세를 입력해주세요.";
    return;
  }

  // 만원 단위 -> 원 단위
  let amount = 0;
  if (transactionType.value === 'sale' || transactionType.value === 'lease') {
    amount = priceValue.value * 10000;
  } else if (transactionType.value === 'monthlyRent') {
    // 보증금+월세 계산 (만약 더 엄밀한 계산법 적용시 조정)
    let baseAmount = priceValue.value + monthlyRentValue.value * 100;
    if (baseAmount * 10000 < 50000000) {
      baseAmount = priceValue.value + monthlyRentValue.value * 70;
    }
    amount = baseAmount * 10000;
  }
  result.transactionAmount = amount;

  // 수수료율 및 한도
  let rate = 0, limit = null;
  if (propertyType.value === 'housing') {
    if (transactionType.value === 'sale') {
      if (amount < 50000000) { rate = 0.006; limit = 250000; }
      else if (amount < 200000000) { rate = 0.005; limit = 800000; }
      else if (amount < 900000000) { rate = 0.004; }
      else if (amount < 1200000000) { rate = 0.005; }
      else if (amount < 1500000000) { rate = 0.006; }
      else { rate = 0.007; }
    } else if (transactionType.value === 'lease' || transactionType.value === 'monthlyRent') {
      if (amount < 50000000) { rate = 0.005; limit = 200000; }
      else if (amount < 100000000) { rate = 0.004; limit = 300000; }
      else if (amount < 600000000) { rate = 0.003; }
      else if (amount < 1200000000) { rate = 0.004; }
      else if (amount < 1500000000) { rate = 0.005; }
      else { rate = 0.006; }
    }
  } else if (propertyType.value === 'officetel') {
    if (transactionType.value === 'sale') { rate = 0.005; }
    else { rate = 0.004; }
  } else {
    rate = 0.009;
  }

  result.rate = rate;
  result.limit = limit;

  let calculated = amount * rate;
  if (limit && calculated > limit) {
    result.commission = limit;
  } else {
    result.commission = Math.floor(calculated);
  }
}
</script>

<style scoped>
.commission-calculator {
  max-width: 500px;
  margin: 2rem ;
  border-radius: 12px;
}
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.option-btn-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-box {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--color-light);
  border-radius: 10px;
  font-size: 16px;
  color: var(--color-text);
  transition: border 0.2s;
}
.input-box:focus {
  border-color: var(--color-primary);
}
.input-with-unit span {
  margin-left: 0.5rem;
  color: var(--color-mediumgray);
}

.formatted-price {
  margin-top: 2px;
  color: var(--color-primary);
}

.calc-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
}

.result-container {
  padding-top: 0.5rem;
}
.result-container h3 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  align-items: center;
}
.result-item .label {
    letter-spacing: -0.03em;
    color: var(--color-darkgray);
}
.result-item .value {
  color: #333;
}
.final-commission .value {
  color: #bf0000;
}
.total-amount .value {
  color: var(--color-primary);
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
}
.error-message {
  text-align: center;
  color: #bf0000;
  margin-top: 1rem;
}
</style>
