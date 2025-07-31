<template>
  <div v-if="dangerResultStore.descriptionTitleList.length > 0">
    <div
      v-for="(title, index) in dangerResultStore.descriptionTitleList"
      :key="index"
      class="bodyMedium16px"
    >
      <details>
        <summary>{{ title }}</summary>
        <div
          class="bodyMedium12px"
          v-html="dangerResultStore.descriptionContentList[index]"
          style="margin-top: 8px"
        ></div>
      </details>
    </div>
  </div>

  <div v-else-if="dangerResultStore.grade" class="bodyMedium16px">
    위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.
  </div>

  <div v-else class="bodyMedium16px">결과를 불러오는 중입니다...</div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';

const dangerResultStore = useDangerResultStore();
</script>

<style scoped>
details {
  border: 1px solid var(--color-light);
  border-radius: 12px;
  padding: 16px 16px;
  margin-bottom: 12px;
  background-color: var(--color-white);
  transition: all 0.3s ease;
}

summary {
  list-style: none;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  color: var(--color-black);
}

summary::marker {
  display: none;
}

details[open] {
  background: #eeeff6;
}

details > div {
  margin-top: 8px;
  color: var(--color-darkgray);
  line-height: 1.5;
  background-color: var(--color-white);
  padding: 8px 12px;
  border-radius: 8px;
}
</style>
