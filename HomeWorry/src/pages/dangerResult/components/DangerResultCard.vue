<template>
  <div class="card">
    <div class="content-row">
      <img
        class="result-image"
        :src="dangerResultStore.imageUrl"
        alt="위험도 이미지"
      />
      <div class="text-box">
        <div class="grade titleBold20px">
          {{ dangerResultStore.grade }}
        </div>
        <div class="message bodyMedium16px">
          {{ dangerResultStore.message }}
        </div>
      </div>
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
}

.content-row {
  display: flex;
  align-items: center;
  gap: 60px;
}

.result-image {
  width: 120px;
  height: 120px;
}

.text-box {
  display: flex;
  flex-direction: column;
}

.grade {
  margin-bottom: 4px;
  color: #ef5957;
}

.message {
  color: #ef5957;
  text-decoration: underline;
}
</style>
