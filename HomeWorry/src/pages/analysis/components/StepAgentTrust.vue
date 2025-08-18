<template>
  <div class="agency-trust-check">
    <div class="label-row">
      <label class="input-label bodyMedium20px">중개사무소 이름</label>
      <HelpButton :message="addressMessage" />
    </div>
    <InputField
      placeholder="중개사무소 이름을 검색해주세요."
      v-model="agentName"
      desc="•중개사무소 이름을 통한 검색으로 해당 중개사무소의 정보를 검색할 수 있습니다."
      :readonly="true"
    />

    <div class="label-row">
      <label class="input-label bodyMedium20px">중개사무소 주소</label>
      <HelpButton :message="addressMessage" />
    </div>
    <InputField
      placeholder="주소를 검색해주세요."
      v-model="address"
      desc="•중개사무소 주소를 기반으로 등록 이력 및 행정처분 여부를 분석해 신뢰도와 위법 이력 등 부동산 거래 시 유의해야 할 요소를 사전에 확인할 수 있습니다."
      :readonly="true"
      @click="handleOpenPostcode"
    />

    <div class="label-row">
      <label class="input-label bodyMedium20px">중개사무소 등록번호</label>
      <HelpButton :message="agentIdMessage" />
    </div>
    <InputField
      placeholder="예: 12345-6789"
      v-model="agentRegisterNumber"
      desc="•등록번호를 기반으로 중개사무소의 유효성 및 과거 행정처분 여부를 자동으로 분석해 신뢰도 검토에 활용됩니다."
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputField from '@/components/input/InputField.vue';
import { openPostcode } from '../composables/usePostcode.js';
import { useAnalysisStore } from '@/stores/analysis.js';
import { storeToRefs } from 'pinia';
import HelpButton from '@/components/button/HelpButton.vue';

const analysisStore = useAnalysisStore();
const { middleAgent } = storeToRefs(analysisStore);

const agentName = ref(middleAgent.value.agentName);
const address = ref(middleAgent.value.address);
const agentRegisterNumber = ref(middleAgent.value.agentRegisterNumber);
const addressMessage = ref(
  '앞에서 입력한 주소의 매물을 관리하는 중개사무소를 찾고 없다면 입력받아 사용자에게 중개사무소 정보를 알려줍니다.'
);
const agentIdMessage = ref(
  '중개사무소의 등록번호를 검색해서 전문 중개 사무소인지 확인합니다.'
);

function handleOpenPostcode() {
  openPostcode((data) => {
    address.value = data.address;
  });
}

watch(agentName, (val) => {
  analysisStore.middleAgent.agentName = val;
});

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
  gap: 2px;
}

.label-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.input-label {
  margin-bottom: -4px;
  display: block;
  color: var(--color-primary);
}
</style>
