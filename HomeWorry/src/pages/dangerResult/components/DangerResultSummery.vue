<template>
  <h3>{{ dangerResultStore.dangerResultData.message }}</h3>
  <div>{{ dangerResultStore.dangerResultData.description }}</div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';
const dangerResultStore = useDangerResultStore();
</script>

<style scoped></style>
