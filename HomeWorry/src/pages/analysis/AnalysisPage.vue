<template>
  <br />
  <StepNavigationBar
    :steps="steps"
    :currentStep="currentStep"
    mode="analysis"
    @update:currentStep="handleStepChange"
    @stageChange="handleStageChange"
  />
  <br />
  <div class="analysis-page">
    <StepBuildingHistory v-if="currentStep === 1" />
    <StepAgentTrust v-else-if="currentStep === 2" />
    <StepRiskAnalysis v-else-if="currentStep === 3" />
    <StepCheckRegistryInfo v-else-if="currentStep === 4" />

    <div class="fixed-footer-btn">
      <StepButton :text="buttonText" @click="handleButtonClick" />
    </div>

    <CustomModal
      v-model="isModalOpen"
      :message="modalMessage"
      confirmText="확인"
      cancelText=""
      @confirm="onModalConfirm"
      @cancel="onModalCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StepNavigationBar from '@/components/navigation/StepNavigationBar.vue';

import StepCheckRegistryInfo from './components/StepCheckRegistryInfo.vue';
import StepBuildingHistory from './components/StepBuildingHistory.vue';
import StepAgentTrust from './components/StepAgentTrust.vue';
import StepRiskAnalysis from './components/StepRiskAnalysis.vue';

import StepButton from '@/components/button/BtnMed.vue';
import CustomModal from '@/components/modal/CustomModal.vue';

import { useAnalysisStep } from '@/composables/useAnalysisStep';
import { useAnalysisStore } from '@/stores/analysis.js';
import { useRouter } from 'vue-router';
import axios from 'axios';

const { steps, setStageByIndex } = useAnalysisStep();
const currentStep = ref(1);
const analysisStore = useAnalysisStore();
const router = useRouter();

const isModalOpen = ref(false);
const modalMessage = ref('');
const modalConfirmCallback = ref(null);

function openModal(message, onConfirm = null) {
  modalMessage.value = message;
  modalConfirmCallback.value = onConfirm;
  isModalOpen.value = true;
}

function onModalConfirm() {
  isModalOpen.value = false;
  if (modalConfirmCallback.value) {
    modalConfirmCallback.value();
  }
}

function onModalCancel() {
  isModalOpen.value = false;
}

async function fetchAgentByAddress(address) {
  try {
    const { data } = await axios.get(
      'http://localhost:8080/analysis/agent/address',
      {
        params: { houseAddress: address },
      }
    );
    console.log('중개사 정보 API 응답:', data);

    if (data && data.length > 0) {
      const agent = data[0];
      analysisStore.middleAgent = {
        ...analysisStore.middleAgent,
        address: agent.address || analysisStore.middleAgent.address,
        agentRegisterNumber:
          agent.licenseNumber || analysisStore.middleAgent.agentRegisterNumber,
      };
    }
  } catch (error) {
    console.error('중개사 정보 불러오기 실패:', error);
  }
}

async function handleStepChange(stepNumber) {
  if (currentStep.value === 1 && stepNumber === 2) {
    if (
      analysisStore.houseAddress &&
      analysisStore.houseAddress.trim() !== ''
    ) {
      await fetchAgentByAddress(analysisStore.houseAddress);
    }
  }

  currentStep.value = stepNumber;
  setStageByIndex(stepNumber - 1);
}

async function handleStageChange(index, stepName) {
  const nextStep = index + 1;

  if (currentStep.value === 1 && nextStep === 2) {
    if (
      analysisStore.houseAddress &&
      analysisStore.houseAddress.trim() !== ''
    ) {
      await fetchAgentByAddress(analysisStore.houseAddress);
    }
  }

  currentStep.value = nextStep;
  setStageByIndex(index);
}

const buttonText = computed(() =>
  currentStep.value === steps.value.length
    ? '분석 시작하기'
    : '다음 단계 넘어가기'
);

async function handleButtonClick() {
  if (currentStep.value === steps.value.length) {
    startAnalysis();
  } else {
    if (
      currentStep.value === 1 &&
      analysisStore.houseAddress &&
      analysisStore.houseAddress.trim() !== ''
    ) {
      await fetchAgentByAddress(analysisStore.houseAddress);
    }
    currentStep.value++;
    setStageByIndex(currentStep.value - 1);
  }
}

async function startAnalysis() {
  const sthRisk = analysisStore.sthRisk;

  // 숫자 변환
  const priceNum = Number(sthRisk.price);
  const monthlyPriceNum = Number(sthRisk.monthlyPrice);
  const sizeNum = Number(sthRisk.size);

  // 문자열 유효성 검사 함수
  const isValidString = (str) => typeof str === 'string' && str.trim() !== '';

  const typeValid = isValidString(sthRisk.type);
  const houseAddressValid = isValidString(analysisStore.houseAddress);

  // 매물 주소가 없는데 리스크 분석 데이터가 있으면 안 됨
  if (
    !houseAddressValid &&
    (typeValid || priceNum > 0 || monthlyPriceNum > 0 || sizeNum > 0)
  ) {
    openModal(
      '❗️ 매물 주소가 입력되지 않았는데 리스크 분석 데이터가 있습니다.\n\n' +
        '✅ 매물 주소는 필수 정보이며, 정확한 분석을 위해 반드시 입력이 필요합니다.\n\n' +
        '매물 주소를 먼저 입력해주세요.'
    );
    return;
  }

  // 거래 유형 없이 거래가 입력되어 있으면 안 됨
  if (!typeValid && (priceNum > 0 || monthlyPriceNum > 0)) {
    openModal(
      '❗️ 거래 유형이 선택되지 않았는데 거래가가 입력되어 있습니다.\n\n거래 유형을 먼저 선택해주세요.'
    );
    return;
  }

  // 분석에 필요한 모든 데이터를 묶어 백엔드 API로 전송하기 위한 객체
  const documentData = {
    houseAddress: analysisStore.houseAddress,
    documentAgentDTO: { ...analysisStore.middleAgent },
    documentSthRiskDTO: { ...analysisStore.sthRisk },
    registerCertifiedCount: analysisStore.registerCertifiedCount,
  };
  console.log('서버로 전송하는 데이터:', documentData);

  try {
    // documentData를 문자열로 바꿔서 쿼리로 넘김
    await router.push({
      path: '/dangerResult',
      query: { documentData: JSON.stringify(documentData) },
    });
  } catch (error) {
    openModal('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}
</script>

<style scoped>
.analysis-page {
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 90px);
  margin: 0 2rem;
}

.fixed-footer-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 90px);
  z-index: 100;
  display: flex;
  justify-content: center;
}
</style>
