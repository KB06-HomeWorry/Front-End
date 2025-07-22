import { defineStore } from "pinia";
import { ref } from "vue";
import { reactive } from "vue";

export const useDangerResultStore = defineStore("dangerResult", () => {
  const grade = ref("Low");
  const message = ref("위험 낮음");
  const descriptionTitleList = ref([""]);
  const descriptionContentList = ref([""]);
  const imageUrl = ref("");

  function setDangerResult(
    newgrade,
    newmessage,
    newdescriptionTitle,
    newdescriptionContent,
    newimageUrl
  ) {
    // console.log(newdescriptionContent);

    // 상태 업데이트
    grade.value = newgrade;
    message.value = newmessage;
    descriptionTitleList.value = newdescriptionTitle;
    descriptionContentList.value = newdescriptionContent;
    imageUrl.value = newimageUrl;
  }

  return {
    grade,
    message,
    descriptionTitleList,
    descriptionContentList,
    imageUrl,
    setDangerResult,
  };
});
