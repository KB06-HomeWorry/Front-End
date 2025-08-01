<template>
  <div class="checklist-page">
    <p class="desc bodyMedium20px">
      <span class="emoji">{{ stageEmoji }}</span>
      {{ checklistStore.checklistData.stage }}
    </p>

    <ChecklistQuestion @progress-full="handleProgressFull" />

    <img
      v-if="showCelebrationImage"
      class="celebration-img"
      src="@/assets/images/celebration.png"
    />

    <div class="fab-btn">
      <CircleButton @click="handleSaveRequested" />
    </div>

    <CustomModal
      v-model:modelValue="showModal"
      :message="`${checklistStore.checklistData.stage} 단계 답변이 저장되었어요😊\n결과를 확인해볼까요?`"
      @confirm="handleModalConfirm"
      @cancel="() => (showModal = false)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import ChecklistQuestion from "./components/ChecklistQuestion.vue";
import CircleButton from "./components/CircleButton.vue";
import CustomModal from "@/components/modal/CustomModal.vue";

import { useChecklistStore } from "@/stores/checklist";

const route = useRoute();
const router = useRouter();
const checklistStore = useChecklistStore();

const showModal = ref(false);
const showCelebrationImage = ref(false);

const stageEmojis = {
  "계약 전": "📝",
  "중도금 납부": "💰",
  "잔금 및 입주": "🏠",
  "잔금 및 소유권 이전": "🏠",
  "입주 후": "🎉",
};

const stageEmoji = computed(() => {
  return stageEmojis[checklistStore.checklistData.stage] || "";
});

onMounted(async () => {
  const { type, stage, userId } = route.query;

  if (type && stage && userId) {
    checklistStore.checklistData.type = type;
    checklistStore.checklistData.stage = stage;
    checklistStore.checklistData.userId = parseInt(userId);
    console.log("스토어 초기화 완료:", checklistStore.checklistData);
  }

  await checklistStore.loadChecklist();
});

async function handleSaveRequested() {
  try {
    const userId = checklistStore.checklistData.userId;

    const answerDTOList = checklistStore.checklist.map((item) => ({
      questionId: item.questionId,
      userId,
      answer: item.checked || false,
    }));

    console.log("저장할 데이터:", answerDTOList);

    await axios.post("http://localhost:8080/checklist/answers", answerDTOList);

    showModal.value = true;
  } catch (error) {
    console.error("저장 실패:", error);
    alert("저장에 실패했습니다.");
  }
}

function handleModalConfirm() {
  const { type, stage, userId } = checklistStore.checklistData;
  router.push({
    path: "/dangerResult",
    query: {
      type,
      stage,
      user_id: userId,
    },
  });
}

function handleProgressFull() {
  showCelebrationImage.value = true;
  setTimeout(() => {
    showCelebrationImage.value = false;
  }, 1000);
}
</script>

<style scoped>
.checklist-page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 20px 40px;
  background-color: var(--color-white);
  box-sizing: border-box;
  max-width: 430px;
  margin: 0 auto;
}

.desc {
  color: var(--color-black);
  margin-bottom: 16px;
}

.fab-btn {
  position: fixed;
  bottom: 100px;
  left: 48%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  box-sizing: border-box;
  z-index: 100;
}

.celebration-img {
  width: 100px;
  height: auto;
  margin-top: 24px;
  animation: fadeInOut 1s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
