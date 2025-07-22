import { defineStore } from "pinia";
import { reactive } from "vue";

export const useDangerResultStore = defineStore("dangerResult", () => {
  const dangerResultData = reactive({
    grade: "Low",
    message: "위험 낮음",
    description: "입주 후 특별한 위험 신호가 없습니다.",
    imageUrl: "",
  });

  function setDangerResult(grade, message, description, imageUrl) {
    dangerResultData.grade = grade;
    dangerResultData.message = message;
    dangerResultData.description = description;
    dangerResultData.imageUrl = imageUrl;
  }

  return { dangerResultData, setDangerResult };
});
