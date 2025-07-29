<template>
  <div class="agency-trust-check">
    <InputField
      label="중개사무소 주소"
      placeholder="주소를 검색해주세요."
      v-model="address"
      desc="•중개사무소 주소를 기반으로 등록 이력 및 행정처분 여부를 분석해 신뢰도와 위법 이력 등 부동산 거래 시 유의해야 할 요소를 사전에 확인할 수 있습니다."
      :readonly="true"
      @click="handleOpenPostcode"
    />

    <InputField
      label="중개사무소 등록번호"
      placeholder="예: 12345-6789"
      v-model="agentRegisterNumber"
      desc="•등록번호를 기반으로 중개사무소의 유효성 및 과거 행정처분 여부를 자동으로 분석해 신뢰도 검토에 활용됩니다."
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
const { middleAgent } = storeToRefs(analysisStore);

const address = ref(middleAgent.value.address);
const agentRegisterNumber = ref(middleAgent.value.agentRegisterNumber);

function handleOpenPostcode() {
  openPostcode((data) => {
    address.value = data.address;
  });
}

watch(address, (val) => {
  analysisStore.middleAgent.address = val;
});

watch(agentRegisterNumber, (val) => {
  analysisStore.middleAgent.agentRegisterNumber = val;
});
</script>

<style scoped>
.agency-trust-check {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
