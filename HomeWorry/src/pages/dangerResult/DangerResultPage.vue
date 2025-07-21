<template>
  <DangerCard />
  <DangerSummery />
  <DangerButtons />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDangerResultStore } from '@/stores/dangerResult';
import axios from 'axios';
import DangerCard from './components/DangerResultCard.vue';
import DangerSummery from './components/DangerResultSummery.vue';
import DangerButtons from './components/DangerResultButtons.vue';

const dangerResultStore = useDangerResultStore();
const route = useRoute();

const loadDangerResult = async () => {
  console.log('[loadDangerResult] 실행됨');

  const type = route.query.type;
  const stage = route.query.stage;
  const user_id = route.query.user_id;

  console.log('받은 쿼리값:', type, stage, user_id);

  try {
    const { data } = await axios.get(`http://localhost:8080/dangerResult`, {
      params: { type, stage, user_id },
    });

    console.log('서버 응답:', data);

    dangerResultStore.dangerResultData.grade = data.grade;
    dangerResultStore.dangerResultData.message = data.message;
    dangerResultStore.dangerResultData.description = data.description;
    dangerResultStore.dangerResultData.imageUrl = data.imageUrl;

    console.log('저장된 결과:', dangerResultStore.dangerResultData);
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
  }
};

onMounted(() => {
  console.log('onMounted 실행됨');
  loadDangerResult();
});
</script>

<style scoped></style>
