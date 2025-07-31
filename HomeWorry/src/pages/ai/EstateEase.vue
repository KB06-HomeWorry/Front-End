<template>
  <div class="sentence-simplify-page">
    <div class="title bodyMedium20px">부동산 용어 해석</div>
    <EstateEaseInput v-model="input" :maxlength="100" :minlength="3" />

    <div class="btn-center-wrap">
      <BtnSm
        :text="loading ? '변환 중...' : '변환하기'"
        :disabled="loading || input.trim().length < 3"
        @click="analyze"
        style="margin-top: 8px"
        :class="{ 'btn-disabled-custom': loading || input.trim().length < 3 }"
      />
    </div>

    <div v-if="result" class="result-card">
      <div class="label bodyMedium16px">해석 결과</div>
      <div class="result-content bodyLight12px">{{ result }}</div>
    </div>

    <div v-if="error" class="error-msg bodyLight12px">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import EstateEaseInput from './components/EstateEaseInput.vue';
import BtnSm from '@/components/button/BtnSm.vue';

const input = ref('');
const result = ref('');
const error = ref('');
const loading = ref(false);

function isMeaninglessInput(text) {
  const t = text.trim();
  if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(t)) return true;
  if (/^(.)\1{3,}$/.test(t)) return true;
  if (/(테스트|test|asdf|qwer|dummy|테스)/i.test(t)) return true;
  if (/^\d+$/.test(t)) return true;
  return false;
}

async function analyze() {
  const value = input.value.trim();
  if (!value || isMeaninglessInput(value)) {
    error.value = '실제 부동산 관련 단어나 문장을 입력해 주세요.';
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = '';

  try {
    const response = await axios.post(
      'http://localhost:8080/ai/estate-ease',
      value
    );
    result.value = response.data.result.trim();
  } catch (e) {
    error.value = '서버 오류: ' + (e.response?.data ?? e.message);
  }
  loading.value = false;
}
</script>

<style scoped>
.sentence-simplify-page {
  max-width: 440px;
  margin: 30px auto 0;
  padding: 24px 16px;
  border-radius: 16px;
}

.title {
  margin-bottom: 18px;
  color: var(--color-primary);
}

.btn-center-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
}

.btn-disabled-custom {
  border: 1.2px solid var(--color-primary) !important;
  color: var(--color-primary) !important;
  background: rgba(17, 31, 92, 0.1) !important;
  cursor: not-allowed !important;
}

.result-card {
  background: #f7f9fc;
  border-radius: 8px;
  border: 1px solid var(--color-mediumgray, #e4e7ec);
  padding: 18px 14px 16px 14px;
  margin-top: 40px;
  min-height: 60px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  color: var(--color-primary);
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.result-content {
  color: var(--color-black);
  line-height: 1.7;
  background: none;
  padding: 0;
  white-space: pre-line;
  word-break: break-all;
}

.error-msg {
  color: #e43a3a;
  margin-top: 14px;
  text-align: center;
}
</style>
