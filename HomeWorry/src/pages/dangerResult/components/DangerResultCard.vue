<template>
  <div class="titleBold20px">
    {{ dangerResultStore.grade }}
  </div>
</template>

<script setup>
import { useDangerResultStore } from '@/stores/dangerResult';
const dangerResultStore = useDangerResultStore();
</script>

<style scoped></style>
