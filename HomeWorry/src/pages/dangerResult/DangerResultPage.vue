<template>
  <div class="result-page">
    <div class="title titleBold16px">계약 체크리스트 결과</div>
    <br />
    <div class="section-wrapper">
      <DangerCard />
    </div>
    <div class="bodyLight12px">
      * 본 분석 결과는 참고용이며, 실제 계약 판단은 개인의 책임입니다.
    </div>
    <br />
    <br />
    <div class="content titleBold20px">분석 내용</div>
    <br />
    <div class="section-wrapper">
      <DangerSummery />
    </div>
    <div class="section-wrapper">
      <DangerButtons :moveDefined="moveDefined" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useDangerResultStore } from "@/stores/dangerResult";
import { useAnalysisStore } from "@/stores/analysis.js";
import axios from "axios";

import DangerCard from "./components/DangerResultCard.vue";
import DangerSummery from "./components/DangerResultSummery.vue";
import DangerButtons from "./components/DangerResultButtons.vue";

const dangerResultStore = useDangerResultStore();
const analysisStore = useAnalysisStore();
const route = useRoute();
const moveDefined = ref(0); // 0: 체크리스트 분석, 1: 서류 분석

const loadDangerResult = async () => {
  const { type, stage, user_id } = route.query;

  try {
    const { data } = await axios.get(`http://localhost:8080/dangerResult`, {
      params: { type, stage, user_id },
    });

    console.log("서버 응답:", data);

    dangerResultStore.setDangerResult(
      data.grade,
      data.message,
      data.descriptionTitleList,
      data.descriptionContentList,
      data.imageUrl
    );
  } catch (error) {
    console.error("데이터 로딩 중 오류 발생:", error);
  }
};

const loadAnalysisResult = async () => {
  const documentData = {
    registerCertifiedCount: analysisStore.registerCertifiedCount,
    houseAddress: analysisStore.houseAddress,
    middleAgent: analysisStore.middleAgent,
    sthRisk: analysisStore.sthRisk,
  };

  const { data } = await axios.post(
    `http://localhost:8080/analysis`,
    documentData
  );

  console.log("서버 응답:", data);

  dangerResultStore.setDangerResult(
    data.grade,
    data.message,
    data.descriptionTitleList,
    data.descriptionContentList,
    data.imageUrl
  );
};

onMounted(() => {
  if (route.query.type && route.query.stage && route.query.user_id) {
    console.log("체크리스트 분석 실행됨");
    moveDefined.value = 0;
    loadDangerResult();
  } else {
    console.log("서류 분석 실행");
    moveDefined.value = 1;
    loadAnalysisResult();
  }
});

watch(
  () => route.query,
  () => {
    if (moveDefined.value === 0) {
      loadDangerResult(); // 쿼리 바뀔 때 다시 로딩
    } else {
      loadAnalysisResult(); // 서류 분석 쿼리 바뀔 때 다시 로딩
    }
  }
);
</script>

<style scoped>
.result-page {
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
}

.section-wrapper {
  width: 100%;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  color: var(--color-primary);
  text-align: center;
}

.content {
  color: var(--color-primary);
  text-align: left;
}
</style>
