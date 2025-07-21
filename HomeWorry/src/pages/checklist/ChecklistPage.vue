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
import { ref, onMounted } from "vue";
import { useChecklistStore } from "@/stores/checklist";

const route = useRoute();
const checklistStore = useChecklistStore();

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
