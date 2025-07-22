<template>
  <div v-if="dangerResultStore.message">
    <h3>{{ dangerResultStore.message }}</h3>
    <br />

    <div
      v-for="(title, index) in dangerResultStore.descriptionTitleList"
      :key="index"
      class="description-block"
    >
      <h4>{{ title }}</h4>
      <div v-html="dangerResultStore.descriptionContentList[index]"></div>
      <br />
    </div>
  </div>

  <div v-else>위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.</div>

  <div v-else>
    <p>결과를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { useDangerResultStore } from "@/stores/dangerResult";

const dangerResultStore = useDangerResultStore();

console.log("dangerResultStore:", dangerResultStore.descriptionTitleList);
</script>

<style scoped>
.description-block {
  margin-bottom: 1rem;
}
</style>
