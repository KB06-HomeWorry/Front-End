<template>
  <div class="checklist-page">
    <!-- 상단 안내 문구 -->
    <div class="top-section">
      <p class="desc bodyMedium16px">지금 진행 중인 부동산 거래 단계는?</p>
      <p class="title bodyMedium20px">체크리스트 단계를 선택해주세요</p>
    </div>

    <!-- 단계 카드 리스트 -->
    <div class="card-container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-card"
        :class="{ active: index === activeIndex }"
        @click="goToChecklist(step)"
      >
        <div class="emoji bodyMedium24px">{{ emojis[index] }}</div>
        <div class="label">
          <div class="step-index bodyMedium14px">STEP {{ index + 1 }}</div>
          <div class="step-title bodyMedium16px">{{ step }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useChecklistStore } from "@/stores/checklist";
import { useChecklistStep } from "@/composables/useChecklistStep";

const router = useRouter();
const checklistStore = useChecklistStore();
const steps = ref([]);
const activeIndex = ref(0);
const emojis = ["📝", "💰", "🏠", "🎉"];
let intervalId = null;

// 체크리스트 화면으로 이동
function goToChecklist(step) {
  checklistStore.checklistData.stage = step;

  router.push({
    path: "/checklist",
    query: {
      type: checklistStore.checklistData.type,
      stage: checklistStore.checklistData.stage,
      userId: checklistStore.checklistData.userId,
    },
  });
}

// 초기 데이터 로드 및 자동 인덱스 순환 설정
onMounted(async () => {
  const { type, stage, userId } = router.currentRoute.value.query;
  if (type && stage && userId) {
    checklistStore.checklistData = {
      type,
      stage,
      userId: parseInt(userId),
    };
  }

  const { data } = await axios.get(
    "http://localhost:8080/checklist/answers/five"
  );
  checklistStore.topFiveAnswers = data;
  console.log("서버 응답:", checklistStore.topFiveAnswers);

  await checklistStore.loadChecklist();
  const { steps: loadedSteps } = useChecklistStep();
  steps.value = loadedSteps.value;

  // 자동으로 강조 카드 순환
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % steps.value.length;
  }, 2000);
});

// 타이머 정리
onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.checklist-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 20px 40px;
  background-color: var(--color-white);
  min-height: calc(100vh - 120px);
  box-sizing: border-box;
}

.top-section {
  text-align: center;
  margin-bottom: 32px;
}

.desc {
  color: #666666;
}

.title {
  color: var(--color-black);
}

.card-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.step-card {
  width: 140px;
  height: 140px;
  border-radius: 28px;
  background-color: #f9fafc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 16px 8px;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.step-card:hover {
  transform: scale(1.05);
}

.step-card.active {
  transform: scale(1.1);
  background-color: var(--color-secondarylight);
  opacity: 1;
}

.emoji {
  margin-bottom: 8px;
}

.label {
  color: var(--color-black);
  line-height: 1.4;
  white-space: pre-line;
  text-align: center;
  letter-spacing: -0.08em;
}

.step-title {
  margin-top: 4px;
}
</style>
