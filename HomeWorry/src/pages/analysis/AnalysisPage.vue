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
import axios from 'axios';
import StepNavigationBar from '@/components/navigation/StepNavigationBar.vue';

import StepCheckRegistryInfo from './components/StepCheckRegistryInfo.vue';
import StepBuildingHistory from './components/StepBuildingHistory.vue';
import StepAgentTrust from './components/StepAgentTrust.vue';
import StepRiskAnalysis from './components/StepRiskAnalysis.vue';

import StepButton from '@/components/button/BtnMed.vue';

import { useAnalysisStep } from '@/composables/useAnalysisStep';
import { useAnalysisStore } from '@/stores/analysis.js';
import { useDangerResultStore } from '@/stores/dangerResult';
import { useRoute, useRouter } from 'vue-router';

import CustomModal from '@/components/modal/CustomModal.vue';

const { steps, setStageByIndex } = useAnalysisStep();

const currentStep = ref(1);
const dangerResultStore = useDangerResultStore();
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

function handleStepChange(stepNumber) {
  currentStep.value = stepNumber;
  setStageByIndex(stepNumber - 1);
}

function handleStageChange(index, stepName) {
  currentStep.value = index + 1;
  setStageByIndex(index);
}

const buttonText = computed(() => {
  return currentStep.value === steps.value.length
    ? '분석 시작하기'
    : '다음 단계 넘어가기';
});

function handleButtonClick() {
  if (currentStep.value === steps.value.length) {
    startAnalysis();
  } else {
    currentStep.value++;
    setStageByIndex(currentStep.value - 1);
  }
}

async function startAnalysis() {
  console.log('분석 시작하기 버튼 클릭!\n✅ 저장된 값 확인:');
  console.log('매물 주소:', analysisStore.houseAddress);
  console.log('중개사 정보:', analysisStore.middleAgent);
  console.log('리스크 분석 정보:', analysisStore.sthRisk);
  console.log(
    '등기부등본 체크리스트 개수:',
    analysisStore.registerCertifiedCount
  );

  if (
    !analysisStore.sthRisk.type &&
    analysisStore.sthRisk.price.trim() !== ''
  ) {
    openModal(
      '❗️ 거래 유형이 선택되지 않았는데 거래가가 입력되어 있습니다.\n\n거래 유형을 먼저 선택해주세요.'
    );
    return;
  }

  if (!analysisStore.houseAddress || analysisStore.houseAddress.trim() === '') {
    const sthRisk = analysisStore.sthRisk;
    const hasRiskData =
      sthRisk.type ||
      sthRisk.price ||
      (sthRisk.selectedOptions && sthRisk.selectedOptions.length > 0);
    if (hasRiskData) {
      openModal(
        '❗️ 매물 주소가 입력되지 않았는데 리스크 분석 데이터가 있습니다.\n\n' +
          '✅ 매물 주소는 필수 정보이며,\n정확한 분석을 위해 입력이 필요합니다.\n\n' +
          '매물 주소를 먼저 입력해주세요.'
      );
      return;
    }
  }

  const documentData = {
    registerCertifiedCount: analysisStore.registerCertifiedCount,
    houseAddress: analysisStore.houseAddress,
    middleAgent: analysisStore.middleAgent,
    sthRisk: analysisStore.sthRisk,
  };

  try {
    router.push({
      path: '/dangerResult',
      query: {
        documentData,
      },
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
