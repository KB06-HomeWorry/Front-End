<template>
  <div class="analysis-page">
    <br />
    <StepNavigationBar
      :steps="steps"
      :currentStep="currentStep"
      mode="analysis"
      @update:currentStep="handleStepChange"
      @stageChange="handleStageChange"
    />
    <br />

    <StepCheckRegistryInfo v-if="currentStep === 1" />
    <StepBuildingHistory v-else-if="currentStep === 2" />
    <StepAgentTrust v-else-if="currentStep === 3" />
    <StepRiskAnalysis v-else-if="currentStep === 4" />

    <div class="fixed-footer-btn">
      <StepButton :text="buttonText" @click="handleButtonClick" />
    </div>
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

import { useAnalysisStep } from '@/composables/useAnalysisStep';
import { useAnalysisStore } from '@/stores/analysis.js';

const { steps, setStageByIndex } = useAnalysisStep();

const currentStep = ref(1);

const analysisStore = useAnalysisStore();

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

function startAnalysis() {
  console.log('분석 시작하기 버튼 클릭!\n✅ 저장된 값 확인:');
  console.log(
    '등기부등본 체크리스트 개수:',
    analysisStore.registerCertifiedCount
  );
  console.log('매물 주소:', analysisStore.houseAddress);
  console.log('중개사 정보:', analysisStore.middleAgent);
  console.log('리스크 분석 정보:', analysisStore.sthRisk);
}
</script>

<style scoped>
.fixed-footer-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px;
  z-index: 100;
  padding: 12px 0 46px 0;
  display: flex;
  justify-content: center;
}
</style>
