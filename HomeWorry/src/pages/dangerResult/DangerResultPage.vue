<template>
  <div>
    <SimpleHeader title="분석 결과 확인" />
    <div class="result-page">
      <div class="content titleBold20px">분석 결과</div>
      <br />
      <div class="section-wrapper">
        <DangerCard />
      </div>
      <div class="bodyLight12px">
        * 본 분석 결과는 참고용이며, 실제 계약 판단은 개인 책임입니다.
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
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDangerResultStore } from '@/stores/dangerResult';
import { useAnalysisStore } from '@/stores/analysis.js';
import axios from 'axios';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import DangerCard from './components/DangerResultCard.vue';
import DangerSummery from './components/DangerResultSummery.vue';
import DangerButtons from './components/DangerResultButtons.vue';

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

    console.log('서버 응답(위험도 결과):', data);

    dangerResultStore.setDangerResult(
      data.grade,
      data.message,
      data.descriptionTitleList,
      data.descriptionContentList,
      data.imageUrl
    );
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
  }
};

const loadAnalysisResult = async () => {
  const documentData = {
    houseAddress: analysisStore.houseAddress,
    documentAgentDTO: { ...analysisStore.middleAgent },
    documentSthRiskDTO: { ...analysisStore.sthRisk },
    registerCertifiedCount: analysisStore.registerCertifiedCount,
  };

  try {
    const { data } = await axios.post(
      'http://localhost:8080/analysis',
      documentData
    );

    console.log('서버 응답(분석 결과):', data);

    dangerResultStore.setDangerResult(
      data.grade,
      data.message,
      data.descriptionTitleList,
      data.descriptionContentList,
      data.imageUrl
    );
  } catch (error) {
    console.error('서류 분석 API 호출 중 오류:', error);
  }
};

onMounted(() => {
  if (route.query.type && route.query.stage && route.query.user_id) {
    console.log('체크리스트 분석 실행');
    moveDefined.value = 0;
    loadDangerResult();
  } else {
    console.log('서류 분석 실행');
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
  margin: 1rem 2rem 0;
}

.section-wrapper {
  width: 100%;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.content {
  color: var(--color-primary);
  text-align: left;
}
</style>
