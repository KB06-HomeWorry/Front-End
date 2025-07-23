import { computed } from 'vue';
import { useChecklistStore } from '@/stores/checklist';

export function useChecklistStep() {
  const checklistStore = useChecklistStore();

  const salesSteps = [
    '계약 전',
    '중도금 납부',
    '잔금 및 소유권 이전',
    '입주 후',
  ];
  const rentSteps = ['계약 전', '중도금 납부', '잔금 및 입주', '입주 후'];

  const steps = computed(() => {
    return checklistStore.checklistData.type === '매매'
      ? salesSteps
      : rentSteps;
  });

  const setStageByIndex = (index) => {
    checklistStore.checklistData.stage = steps.value[index];
  };

  return {
    checklistStore,
    steps,
    setStageByIndex,
  };
}
