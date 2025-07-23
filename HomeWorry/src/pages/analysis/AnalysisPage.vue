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
    <br />
    <StepIncident v-if="currentStep === 1" />
    <StepBuildingHistory v-else-if="currentStep === 2" />
    <StepAgentTrust v-else-if="currentStep === 3" />
    <StepRiskAnalysis v-else-if="currentStep === 4" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StepNavigationBar from '@/components/navigation/StepNavigationBar.vue';

import StepIncident from './components/StepIncident.vue';
import StepBuildingHistory from './components/StepBuildingHistory.vue';
import StepAgentTrust from './components/StepAgentTrust.vue';
import StepRiskAnalysis from './components/StepRiskAnalysis.vue';

import { useAnalysisStep } from '@/composables/useAnalysisStep';

const { steps, setStageByIndex } = useAnalysisStep();

const currentStep = ref(1);

function handleStepChange(stepNumber) {
  currentStep.value = stepNumber;
  setStageByIndex(stepNumber - 1);
}

function handleStageChange(index, stepName) {
  currentStep.value = index + 1;
  setStageByIndex(index);
}
</script>

<style scoped></style>
