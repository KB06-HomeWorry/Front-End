<template>
  <h3>{{ dangerResultStore.dangerResultData.message }}</h3>
  <br />
  <div>이 문항을 무시할 때와 이행할 때의 실제 사례와 효과</div>
  <div>{{ dangerResultStore.dangerResultData.description }}</div>
</template>

<script setup>
import { useDangerResultStore } from "@/stores/dangerResult";
const dangerResultStore = useDangerResultStore();
</script>

<style scoped></style>
