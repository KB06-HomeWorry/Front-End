<template>
  <div v-if="dangerResultStore.message">
    <h3>{{ dangerResultStore.message }}</h3>
    <br />
    <div
      v-if="dangerResultStore.description"
      v-html="dangerResultStore.description"
    ></div>
    <div v-else>
      위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.
    </div>
  </div>

  <div v-else>
    <p>결과를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useDangerResultStore } from "@/stores/dangerResult";

const dangerResultStore = useDangerResultStore();
</script>
