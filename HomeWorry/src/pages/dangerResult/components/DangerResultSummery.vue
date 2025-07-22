<template>
  <div v-if="dangerResultStore.descriptionTitleList.length > 0">
    <div
      v-for="(title, index) in dangerResultStore.descriptionTitleList"
      :key="index"
      class="bodyMedium16px"
    >
      {{ title }}
      <br /><br />
      <div
        class="bodyMedium12px"
        v-html="dangerResultStore.descriptionContentList[index]"
      ></div>
      <br />
      <hr />
      <br />
    </div>
  </div>

  <div v-else-if="dangerResultStore.grade" class="bodyMedium16px">
    위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.
  </div>

  <div v-else class="bodyMedium16px">결과를 불러오는 중입니다...<</div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';

const dangerResultStore = useDangerResultStore();

console.log('dangerResultStore:', dangerResultStore.descriptionTitleList);
</script>

<style scoped></style>
