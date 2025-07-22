import { defineStore } from "pinia";
import { ref } from "vue";
import { reactive } from "vue";

export const useDangerResultStore = defineStore("dangerResult", () => {
  const dangerResultData = reactive({
    grade: "Low",
    message: "위험 낮음",
    description: "입주 후 특별한 위험 신호가 없습니다.",
    imageUrl: "",
  });

  const grade = ref("Low");
  const message = ref("위험 낮음");
  const description = ref("입주 후 특별한 위험 신호가 없습니다.");
  const imageUrl = ref("");

  function setDangerResult(grade, message, description, imageUrl) {
    dangerResultData.grade = grade;
    dangerResultData.message = message;
    dangerResultData.description = description;
    dangerResultData.imageUrl = imageUrl;
  }

  function setImageUrl(url) {
    imageUrl.value = url;
  }

  function setDescription(desc) {
    description.value = desc;
  }
  function setGrade(newGrade) {
    grade.value = newGrade;
  }
  function setMessage(newMessage) {
    message.value = newMessage;
  }

  return {
    grade,
    message,
    description,
    imageUrl,
    dangerResultData,
    setDangerResult,
    setImageUrl,
    setDescription,
    setGrade,
    setMessage,
  };
});
