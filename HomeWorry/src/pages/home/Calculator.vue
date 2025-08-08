<template>
  <div class="commission-calculator">
    <!-- 거래 종류 선택 -->
    <div class="form-group bodyMedium16px">
      <CalOption
        label="거래 종류"
        :options="transactionOptions"
        v-model="transactionType"
        placeholder="거래 종류를 선택해주세요."
      />
    </div>

    <!-- 물건 종류 선택 -->
    <div class="form-group bodyMedium16px">
      <CalOption
        label="물건 종류"
        :options="propertyOptions"
        v-model="propertyType"
        placeholder="물건 종류를 선택해주세요."
      />
    </div>

    <!-- 매매/전세 (단일 가격 입력) -->
    <div
      v-if="transactionType !== 'monthlyRent'"
      class="form-group bodyMedium16px"
    >
      <label>{{ transactionType === 'sale' ? '매매가' : '보증금' }}</label>
      <div class="input-with-unit bodyMedium14px">
        <input
          type="text"
          class="input-box"
          :placeholder="
            transactionType === 'sale' ? '예: 50000만원' : '예: 30000만원'
          "
          :value="displayPriceString"
          @input="onPriceInput"
          @focus="focusedInput = 'price'"
          ref="priceInputRef"
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
          class="input-box bodyMedium14px"
          placeholder="예: 1000만원"
          :value="displayPriceString"
          @input="onPriceInput"
          @focus="focusedInput = 'price'"
          ref="priceInputRef"
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

      <label style="margin-top: 16px">월세</label>
      <div class="input-with-unit bodyMedium14px">
        <input
          type="text"
          class="input-box"
          placeholder="예: 50만원"
          :value="displayMonthlyRentString"
          @input="onMonthlyRentInput"
          @focus="focusedInput = 'monthlyRent'"
          ref="monthlyInputRef"
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

    <BtnMedSlim
      @click="handleCalcBtn"
      class="calc-button"
      :text="calcBtnText"
    />

    <div v-if="result.commission !== null" class="result-container">
      <div class="result-item">
        <span class="label bodyMedium14px">적용 거래가액</span>
        <span class="value titleBold16px"
          >{{ formatCurrency(result.transactionAmount) }}원</span
        >
      </div>
      <div class="result-item">
        <span class="label bodyMedium14px">
          상한 요율
          <QuestionTooltip>
            상한요율은 법적으로 정해진 최대 중개보수율입니다. 실제 청구 요율은
            이보다 낮을 수 있습니다.
          </QuestionTooltip>
        </span>
        <span class="value titleBold16px">{{ result.rate * 100 }}%</span>
      </div>

      <div v-if="result.limit" class="result-item">
        <span class="label bodyMedium14px">한도액</span>
        <span class="value titleBold16px"
          >{{ formatCurrency(result.limit) }}원</span
        >
      </div>
      <hr />
      <div class="result-item final-commission">
        <span class="label bodyMedium14px">최대 중개보수 (VAT 별도)</span>
        <span class="value titleBold16px"
          >{{ formatCurrency(result.commission) }}원</span
        >
      </div>
      <div class="result-item total-amount">
        <span class="label bodyMedium14px">청구 예상 금액 (VAT 포함)</span>
        <span class="value titleBold16px"
          >{{ formatCurrency(Math.floor(result.commission * 1.1)) }}원</span
        >
      </div>
      <div class="result-guide bodyLight12px">
        ※ 위 금액은 법정 상한액이며, 실제 수수료는 중개사와 협의를 <br />
        통해 조정될 수 있습니다.
      </div>
    </div>
    <div v-if="error" class="error-message bodyMedium16px">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';
import NumberButtonGroup from '@/components/input/NumberButtonGroup.vue';
import CalOption from '@/pages/home/components/CalOption.vue';
import QuestionTooltip from '@/components/button/QuestionTooltip.vue';

const propertyType = ref('');
const transactionType = ref('');
const focusedInput = ref('price');

const priceValue = ref(0);
const priceString = ref('');
const priceInputRef = ref(null);

const monthlyRentValue = ref(0);
const monthlyRentString = ref('');
const monthlyInputRef = ref(null);

const result = reactive({
  commission: null,
  transactionAmount: null,
  rate: null,
  limit: null,
});
const error = ref('');

const transactionOptions = [
  { label: '매매', value: 'sale' },
  { label: '전세', value: 'lease' },
  { label: '월세', value: 'monthlyRent' },
];
const propertyOptions = [
  { label: '주택', value: 'housing' },
  { label: '오피스텔', value: 'officetel' },
  { label: '기타', value: 'other' },
];

// 숫자 + '만원' 붙이기 (항상)
const displayPriceString = computed(() =>
  priceValue.value > 0 ? priceValue.value.toLocaleString() + '만원' : ''
);
const displayMonthlyRentString = computed(() =>
  monthlyRentValue.value > 0
    ? monthlyRentValue.value.toLocaleString() + '만원'
    : ''
);

// 입력 처리
function onPriceInput(e) {
  // 숫자만 추출
  const numStr = e.target.value.replace(/[^0-9]/g, '');
  priceValue.value = Number(numStr) || 0;
  // 커서 맨뒤로
  nextTick(() => {
    if (priceInputRef.value) {
      const len = priceInputRef.value.value.length;
      priceInputRef.value.setSelectionRange(len, len);
    }
  });
}
function onMonthlyRentInput(e) {
  const numStr = e.target.value.replace(/[^0-9]/g, '');
  monthlyRentValue.value = Number(numStr) || 0;
  nextTick(() => {
    if (monthlyInputRef.value) {
      const len = monthlyInputRef.value.value.length;
      monthlyInputRef.value.setSelectionRange(len, len);
    }
  });
}

// 금액 버튼 누르면 누적
function addPrice(amount) {
  priceValue.value += amount;
}
function addMonthlyRent(amount) {
  monthlyRentValue.value += amount;
}

function resetCalculator() {
  priceValue.value = 0;
  priceString.value = '';
  monthlyRentValue.value = 0;
  monthlyRentString.value = '';
  result.commission = null;
  result.transactionAmount = null;
  result.rate = null;
  result.limit = null;
  error.value = '';
}

function numberToKoreanWon(num) {
  if (!num) return '0원';
  const units = [
    { value: 100000000, str: '억' },
    { value: 10000, str: '만' },
  ];
  let result = '',
    n = num * 10000;
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
const formattedMonthlyPrice = computed(() =>
  numberToKoreanWon(monthlyRentValue.value)
);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('ko-KR');
};

function calculateCommission() {
  result.commission = null;
  error.value = '';

  if (!transactionType.value) {
    error.value = '거래 종류를 선택해주세요.';
    return;
  }
  if (!propertyType.value) {
    error.value = '물건 종류를 선택해주세요.';
    return;
  }
  if (!priceValue.value || priceValue.value <= 0) {
    error.value = '금액을 입력해주세요.';
    return;
  }
  if (
    transactionType.value === 'monthlyRent' &&
    (!monthlyRentValue.value || monthlyRentValue.value < 0)
  ) {
    error.value = '월세를 입력해주세요.';
    return;
  }

  let amount = 0;
  if (transactionType.value === 'sale' || transactionType.value === 'lease') {
    amount = priceValue.value * 10000;
  } else if (transactionType.value === 'monthlyRent') {
    let baseAmount = priceValue.value + monthlyRentValue.value * 100;
    if (baseAmount * 10000 < 50000000) {
      baseAmount = priceValue.value + monthlyRentValue.value * 70;
    }
    amount = baseAmount * 10000;
  }
  result.transactionAmount = amount;

  let rate = 0,
    limit = null;
  if (propertyType.value === 'housing') {
    if (transactionType.value === 'sale') {
      if (amount < 50000000) {
        rate = 0.006;
        limit = 250000;
      } else if (amount < 200000000) {
        rate = 0.005;
        limit = 800000;
      } else if (amount < 900000000) {
        rate = 0.004;
      } else if (amount < 1200000000) {
        rate = 0.005;
      } else if (amount < 1500000000) {
        rate = 0.006;
      } else {
        rate = 0.007;
      }
    } else if (
      transactionType.value === 'lease' ||
      transactionType.value === 'monthlyRent'
    ) {
      if (amount < 50000000) {
        rate = 0.005;
        limit = 200000;
      } else if (amount < 100000000) {
        rate = 0.004;
        limit = 300000;
      } else if (amount < 600000000) {
        rate = 0.003;
      } else if (amount < 1200000000) {
        rate = 0.004;
      } else if (amount < 1500000000) {
        rate = 0.005;
      } else {
        rate = 0.006;
      }
    }
  } else if (propertyType.value === 'officetel') {
    if (transactionType.value === 'sale') {
      rate = 0.005;
    } else {
      rate = 0.004;
    }
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

const calcBtnText = computed(() =>
  result.commission !== null ? '다시 계산하기' : '계산하기'
);

function handleCalcBtn() {
  if (result.commission !== null) {
    resetCalculator();
  } else {
    calculateCommission();
  }
}
</script>

<style scoped>
.commission-calculator {
  margin: 2rem;
  border-radius: 12px;
}
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
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
  color: var(--color-primary);
}

.input-box {
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border: 1px solid var(--color-light);
  border-radius: 12px;
  transition: border 0.2s;
}
.input-box::placeholder {
  color: var(--color-mediumgray);
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
  margin-left: 8px;
  color: var(--color-primary);
  /* text-align: right; */
}

.calc-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
}

.result-container {
  padding-top: 0.5rem;
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
  line-height: 14px;
}
.result-item .value {
  color: var(--color-black);
}
.final-commission .value {
  color: var(--color-error);
}
.total-amount .value {
  color: var(--color-primary);
}
hr {
  border: none;
  border-top: 1px solid var(--color-lightgray);
  margin: 0.5rem 0;
}

.result-guide {
  margin-top: 8px;
  color: var(--color-mediumgray);
  letter-spacing: -0.03em;
}

.error-message {
  text-align: center;
  color: var(--color-error);
  margin-top: 1rem;
}
</style>
