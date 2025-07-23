import { ref, computed } from 'vue';

export function useAnalysisStep() {
  const analysisSteps = [
    '사건 이력 조회',
    '건축물 이력 확인',
    '중개인 신뢰도 검토',
    '매물 리스크 분석',
  ];

  const steps = computed(() => analysisSteps);

  const currentStage = ref(analysisSteps[0]);

  const setStageByIndex = (index) => {
    currentStage.value = analysisSteps[index];
  };

  return {
    steps,
    currentStage,
    setStageByIndex,
  };
}
