import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useChecklistStore = defineStore("checklist", () => {
  const checklistData = ref({
    type: "매매",
    stage: "계약 전",
    userId: 1,
  });

  const checklist = ref([]);
  const answerList = ref([]);
  const topFiveFalseAnswers = ref([]);

  const loadChecklist = async () => {
    const { type, stage, userId } = checklistData.value;

    try {
      const response = await axios.get("http://54.66.153.95:8080/checklist", {
        params: { type, stage, user_id: userId },
      });

      const data = response.data;

      if (!data || !Array.isArray(data.checklist)) {
        console.error("Invalid checklist data:", data);
        checklist.value = [];
        answerList.value = [];
        return;
      }

      checklist.value = data.checklist.map((item) => {
        const answer = data.answers?.find(
          (ans) => ans.questionId === item.checklistId
        );
        return {
          ...item,
          questionId: item.checklistId,
          checked: answer ? Boolean(answer.answer) : false,
        };
      });

      answerList.value = data.answers || [];
    } catch (error) {
      console.error("Checklist load error:", error);
      checklist.value = [];
      answerList.value = [];
    }
  };

  const resetChecklist = async () => {
    checklist.value.forEach((item) => {
      item.checked = false;
    });

    answerList.value.forEach((answer) => {
      answer.answer = false;
    });

    try {
      await axios.post(
        "http://54.66.153.95:8080/checklist/answers",
        answerList.value
      );
      // console.log('서버에 초기화된 답변 저장 완료');
    } catch (error) {
      console.error("초기화된 답변 저장 실패:", error);
    }
  };

  return {
    checklistData,
    checklist,
    answerList,
    topFiveFalseAnswers,
    loadChecklist,
    resetChecklist,
  };
});
