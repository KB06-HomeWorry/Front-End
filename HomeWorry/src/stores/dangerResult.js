import { defineStore } from "pinia";
import { ref } from "vue";

export const useDangerResultStore = defineStore("dangerResult", () => {
  //console.log("useChecklistStore called");
  const dangerResultData = ref({
    grade: "Low",
    message: "위험 낮음",
    description: "입주 후 특별한 위험 신호가 없습니다.",
    imageUrl: "",
  });
  //console.log("checklistData initialized:", dangerResultData.value);
  return { dangerResultData };
});
