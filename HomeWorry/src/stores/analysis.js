import { defineStore } from "pinia";
import { ref } from "vue";

export const useAnalysisStore = defineStore("analysis", () => {
  const registerCertifiedCount = ref(0);
  const houseAddress = ref("");
  const middleAgent = ref({
    address: "",
    agentRegisterNumber: "",
  });
  const sthRisk = ref({
    type: "",
    price: "",
    optionCount: 0,
    selectedOptions: [],
  });

  return {
    registerCertifiedCount,
    houseAddress,
    middleAgent,
    sthRisk,
  };
});
