<template>
  <h3>{{ dangerResultStore.dangerResultData?.message }}</h3>
  <br />

  <div
    v-if="dangerResultStore.dangerResultData?.description"
    v-html="dangerResultStore.dangerResultData.description"
  ></div>

  <div v-else>위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDangerResultStore } from '@/stores/dangerResult';

const dangerResultStore = useDangerResultStore();
</script>
