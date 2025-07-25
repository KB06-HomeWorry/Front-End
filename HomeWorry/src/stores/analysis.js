import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAnalysisStore = defineStore('analysis', () => {
  const registerCertifiedCount = ref(0);
  const checklistAnswers = ref({
    address: {},
    ownership: {},
    collateral: {},
  });
  const houseAddress = ref('');
  const middleAgent = ref({
    address: '',
    registerNumber: '',
  });
  const sthRisk = ref({
    type: '',
    price: '',
    optionCount: 0,
    selectedOptions: [],
  });

  return {
    registerCertifiedCount,
    checklistAnswers,
    houseAddress,
    middleAgent,
    sthRisk,
  };
});
