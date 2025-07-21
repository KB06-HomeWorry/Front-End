<template>
  <DangerCard />
  <DangerSummery />
  <DangerButtons />
</template>

<script setup>
import { onMounted } from "vue";
import { useDangerResultStore } from "@/stores/dangerResult";
import axios from "axios";
import DangerCard from "./components/DangerResultCard.vue";
import DangerSummery from "./components/DangerResultSummery.vue";
import DangerButtons from "./components/DangerResultButtons.vue";
const dangerResultStore = useDangerResultStore();

const loadDangerResult = async () => {
  const type = "전/월세"; // 예시, 실제로는 route.query에서 받아올 것
  const stage = "중도금 납부"; // 예시, 실제로는 route.query에서 받아
  const user_id = 1; // 예시, 실제로는 route.query에서 받아올 것

  const { data } = await axios.get(`http://localhost:8080/dangerResult`, {
    params: { type, stage, user_id },
  });

  console.log("위험 분석 결과:", data);
  dangerResultStore.dangerResultData.grade = data.grade;
  dangerResultStore.dangerResultData.message = data.message;
  dangerResultStore.dangerResultData.description = data.description;
  dangerResultStore.dangerResultData.imageUrl = data.imageUrl;
};

onMounted(loadDangerResult());
</script>

<style scoped></style>
