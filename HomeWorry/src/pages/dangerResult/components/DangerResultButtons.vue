<template>
  <div class="button-group">
    <BtnMed
      text="서류 분석"
      color="#ffffff"
      @click="handleClick('documentAnalysis')"
    />
    <BtnMed
      text="AI 계약서 분석"
      color="#ffffff"
      @click="handleClick('aiContractAnalysis')"
    />
    <BtnMed text="점검 다시하기" @click="checklistAgain()" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useChecklistStore } from "@/stores/checklist";
import BtnMed from "@/components/button/BtnMed.vue";

const router = useRouter();

const checklistStore = useChecklistStore();
const type = checklistStore.checklistData.type;
checklistStore.checklistData.stage = "계약 전";
const stage = "계약 전";
const userId = checklistStore.checklistData.userId;

const handleClick = (action) => {
  switch (action) {
    case 'documentAnalysis':
      console.log('서류 분석 버튼 클릭됨');
      // 여기에 서류 분석 관련 로직 추가
      break;
    case 'aiContractAnalysis':
      console.log('AI 계약서 분석 버튼 클릭됨');
      // 여기에 AI 계약서 분석 관련 로직 추가
      break;
    default:
      console.log('알 수 없는 액션:', action);
  }
};

const checklistAgain = () => {
  console.log("점검 다시하기 버튼 클릭");

  router.push({
    path: "/checklist",
    query: {
      type,
      stage,
      userId,
    },
  });
};
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
}
</style>
