<template>
  <div class="incident-form">
    <InputField
      label="매물 소유자 이름"
      placeholder="매물 소유자 이름을 작성하세요."
      v-model="ownerName"
    />
    <InputField
      label="매물 소유자 생년월일"
      placeholder="예: 1990.01.01"
      v-model="ownerBirth"
      type="text"
      desc="•매물 소유자의 이름과 생년월일을 기반으로, 소유자의 신상 정보와 가압류·압류 등 법적 위험 요소를 자동으로 분석해, 부동산 거래 시 발생할 수 있는 리스크를 사전에 확인할 수 있습니다."
      @input="handleInput"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputField from '@/components/input/InputField.vue';

const ownerName = ref('');
const ownerBirth = ref('');

function handleInput(e) {
  const val = e.target.value;
  const digitsOnly = val.replace(/\D/g, '').slice(0, 8);

  let formatted = '';
  if (digitsOnly.length >= 4) {
    formatted += digitsOnly.slice(0, 4);
    if (digitsOnly.length >= 6) {
      formatted += '.' + digitsOnly.slice(4, 6);
      if (digitsOnly.length > 6) {
        formatted += '.' + digitsOnly.slice(6, 8);
      }
    } else {
      formatted += '.' + digitsOnly.slice(4);
    }
  } else {
    formatted = digitsOnly;
  }
  ownerBirth.value = formatted;
}
</script>

<style scoped>
.incident-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
</style>
