<template>
  <div class="card">
    <div class="grade titleBold16px">
      {{ dangerResultStore.grade }}
    </div>
    <div class="message bodyMedium12px">
      {{ dangerResultStore.message }}
    </div>
  </div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';
const dangerResultStore = useDangerResultStore();
</script>

<style scoped>
.card {
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 24px;
  text-align: center;
}

.grade {
  margin-bottom: 8px;
  color: #ef5957;
}

.message {
  color: #ef5957;
  text-decoration: underline;
}
</style>
