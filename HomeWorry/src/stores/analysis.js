import { defineStore } from "pinia";
import { ref } from "vue";

export const analysisStore = defineStore("analysis", () => {
  const registerCertifiedCount = ref(0);
  const houseAddress = ref("");
  const middleAgent = ref({
    address: "",
    registerNumber: "",
  });
  const sthRisk = ref({
    type: "",
    price: 0,
    optionCount: 0,
  });

  return {
    registerCertifiedCount,
    houseAddress,
    middleAgent,
    sthRisk,
  };
});
