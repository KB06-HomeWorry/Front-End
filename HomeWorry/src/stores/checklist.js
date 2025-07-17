import { defineStore } from "pinia";
import { ref } from "vue";

export const useChecklistStore = defineStore("checklist", () => {
  console.log("useChecklistStore called");
  const checklistData = ref({
    type: "매매",
    stage: "계약 전",
  });
  console.log("checklistData initialized:", checklistData.value);
  return { checklistData };
});
