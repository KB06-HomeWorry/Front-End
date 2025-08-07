<template>
  <div class="sentence-simplify-page">
    <AIExplain class="explain-box" />
    <EstateEaseInput v-model="input" :maxlength="100" :minlength="3" />

    <div class="btn-center-wrap">
      <BtnMedSlim
        :text="loading ? '변환 중...' : '변환하기'"
        :disabled="loading || input.trim().length < 3"
        @click="analyze"
        style="margin-top: 8px"
        :class="{ 'btn-disabled-custom': loading || input.trim().length < 3 }"
      />
    </div>

    <div v-if="result" class="result-card">
      <div class="result-title bodyMedium14px">
        <img :src="lightbulbIcon" alt="해석 아이콘" class="result-icon" />
        <span>해석 결과</span>
      </div>
      <div class="result-content bodyLight12px">{{ result }}</div>
    </div>

    <div v-if="error" class="error-msg bodyLight12px">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import lightbulbIcon from "@/assets/icons/quiz_lightbulb.png";
import axios from "axios";
import AIExplain from "@/pages/ai/components/AIExplain.vue";
import EstateEaseInput from "./components/EstateEaseInput.vue";
import BtnMedSlim from "@/components/button/BtnMedSlim.vue";

const input = ref("");
const result = ref("");
const error = ref("");
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
    error.value = "실제 부동산 관련 단어나 문장을 입력해 주세요.";
    return;
  }
  loading.value = true;
  error.value = "";
  result.value = "";

  try {
    const response = await axios.post(
      "http://54.66.153.95:8080/ai/estate-ease",
      value
    );
    result.value = response.data.result.trim();
  } catch (e) {
    error.value = "서버 오류: " + (e.response?.data ?? e.message);
  }
  loading.value = false;
}
</script>

<style scoped>
.sentence-simplify-page {
  max-width: 440px;
  margin: 1.5rem 2rem;
}

.explain-box {
  margin-bottom: 1.5rem;
}

.btn-center-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-disabled-custom {
  border: 1px solid var(--color-lightgray) !important;
  color: var(--color-lightgray) !important;
  cursor: not-allowed !important;
  background-color: #fff !important;
}

.result-card {
  background: #f7f9fc;
  border-radius: 12px;
  border: 1px solid var(--color-mediumgray, #e4e7ec);
  padding: 16px 14px 16px 14px;
  margin-top: 40px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
}

.result-title {
  display: flex;
  align-items: center;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.result-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  margin-right: 3px;
  margin-bottom: 6px;
}

.result-content {
  color: var(--color-black);
  background: none;
  padding: 0;
  white-space: pre-line;
  word-break: break-all;
  text-align: left;
}

.error-msg {
  color: var(--color-danger);
  margin-top: 14px;
  text-align: center;
}
</style>
