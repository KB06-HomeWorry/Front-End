<template>
  <div class="address-form">
    <InputField
      label="매물 주소"
      placeholder="주소를 검색해주세요"
      v-model="propertyAddress"
      desc="•매물 주소를 기반으로, 건축물대장에 등록된 구조, 용도 등의 정보를 자동으로 분석해, 불법 건축물 여부 등 부동산 거래 시 유의해야 할 위험 요소를 사전에 확인할 수 있습니다."
      :readonly="true"
      @click="openPostcode"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputField from '@/components/input/InputField.vue';

const propertyAddress = ref('');
let scriptLoadPromise = null;

function loadPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve();

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error('Daum postcode script load failed'));
      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
}

async function openPostcode() {
  try {
    await loadPostcodeScript();

    new window.daum.Postcode({
      oncomplete: (data) => {
        propertyAddress.value = data.address;
      },
    }).open();
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.address-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
</style>
