import { defineStore } from "pinia";
import { ref } from "vue";

export const useAnalysisStore = defineStore("analysis", () => {
  const houseAddress = ref("");
  const middleAgent = ref({
    address: "",
    agentRegisterNumber: "",
    agentName: "", // 중개사무소 이름
  });

  const sthRisk = ref({
    type: "", // 거래 유형: 전세, 월세, 매매
    price: 0, // 보증금(월세) 또는 거래가(전세/매매)
    monthlyPrice: 0, // 월세
    size: 0, // 평수 (실평수)
  });
  const registerCertifiedCount = ref(0);
  const checklistAnswers = ref({
    address: {},
    ownership: {},
    collateral: {},
  });

  return {
    houseAddress,
    middleAgent,
    sthRisk,
    registerCertifiedCount,
    checklistAnswers,
  };
});
