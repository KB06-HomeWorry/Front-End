<template>
  <h2>{{ dangerResultStore.grade }}</h2>
</template>

<script setup>
import { useDangerResultStore } from "@/stores/dangerResult";
const dangerResultStore = useDangerResultStore();
</script>

<style scoped></style>
