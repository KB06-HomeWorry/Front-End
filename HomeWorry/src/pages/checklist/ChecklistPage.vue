<template>
  <ChecklistNavBar v-model:currentStep="currentStep" />
  <br />
  <ChecklistQuestion />
  <br />
  <br />
  <br />
  <br />
  <div class="fixed-footer-btn">
    <ChecklistBtn
      :currentStep="currentStep"
      :maxStep="4"
      @update:currentStep="(val) => (currentStep = val)"
    />
  </div>
</template>

<script setup>
import ChecklistNavBar from "./components/ChecklistNavBar.vue";
import ChecklistQuestion from "./components/ChecklistQuestion.vue";
import ChecklistBtn from "./components/ChecklistBtn.vue";

import { useRoute } from "vue-router";
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useChecklistStore } from "@/stores/checklist";
import { useChecklistStep } from "@/composables/useChecklistStep";

const route = useRoute();
const checklistStore = useChecklistStore();
const { setStageByIndex } = useChecklistStep();

const currentStep = ref(1);

onMounted(() => {
  const { type, stage, userId } = route.query;
  if (type && stage && userId) {
    checklistStore.checklistData.type = type;
    checklistStore.checklistData.stage = stage;
    checklistStore.checklistData.userId = parseInt(userId);
    console.log("스토어 초기화 완료:", checklistStore.checklistData);
  }
});

watch(currentStep, (newStep) => {
  setStageByIndex(newStep - 1);
});

async function handleSaveRequested() {
  try {
    const userId = checklistStore.checklistData.userId;

    const answerDTOList = checklistStore.checklist.map((item) => ({
      questionId: item.questionId,
      userId: userId,
      answer: item.checked || false,
    }));

    console.log("저장할 데이터:", answerDTOList);

    await axios.post("http://localhost:8080/checklist/answers", answerDTOList);

    alert("저장 성공!");
  } catch (error) {
    console.error("저장 실패:", error);
    alert("저장에 실패했습니다.");
  }
}
</script>

<style scoped>
.fixed-footer-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px; /* 푸터 높이만큼 띄우기 */
  z-index: 100;
  padding: 12px 0 18px 0;
  display: flex;
  justify-content: center;
}
</style>
