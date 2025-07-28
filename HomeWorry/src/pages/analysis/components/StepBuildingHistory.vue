<template>
  <div class="address-form">
    <InputField
      label="매물 주소"
      placeholder="주소를 검색해주세요."
      v-model="propertyAddress"
      desc="•매물 주소를 기반으로, 건축물대장에 등록된 구조, 용도 등의 정보를 자동으로 분석해, 불법 건축물 여부 등 부동산 거래 시 유의해야 할 위험 요소를 사전에 확인할 수 있습니다."
      :readonly="true"
      @click="handleOpenPostcode"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputField from '@/components/input/InputField.vue';
import { openPostcode } from '@/composables/usePostcode.js';
import { useAnalysisStore } from '@/stores/analysis.js';
import { storeToRefs } from 'pinia';

const analysisStore = useAnalysisStore();
const { houseAddress } = storeToRefs(analysisStore);

const propertyAddress = ref(houseAddress.value);

function handleOpenPostcode() {
  openPostcode((data) => {
    propertyAddress.value = data.address;
  });
}

watch(propertyAddress, (val) => {
  analysisStore.houseAddress = val;
});
</script>

<style scoped>
.address-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
