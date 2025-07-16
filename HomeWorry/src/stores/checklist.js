import { defineStore } from "pinia";
import { ref } from "vue";

export const useChecklistStore = defineStore("checklist", () => {
  const checklistData = ref({
    stage: "매매",
    type: "계약 전",
  });
  return { checklistData };
});
