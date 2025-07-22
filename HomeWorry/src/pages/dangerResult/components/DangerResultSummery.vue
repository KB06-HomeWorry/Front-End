<template>
  <div>
    <div class="bodyMedium20px">
      {{ dangerResultStore.message }}
    </div>

    <br />
    <div
      class="bodyMedium16px"
      v-if="dangerResultStore.description"
      v-html="dangerResultStore.description"
    ></div>
    <div v-else>
      위험 수준이 낮아 별도의 점검 결과 설명은 제공되지 않습니다.
    </div>
  </div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';

const dangerResultStore = useDangerResultStore();
</script>
