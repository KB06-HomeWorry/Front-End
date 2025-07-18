<template>
  <DangerCard />
  <DangerSummery />
  <DangerButtons />
</template>

<script setup>
import DangerCard from "./components/DangerResultCard.vue";
import DangerSummery from "./components/DangerResultSummery.vue";
import DangerButtons from "./components/DangerResultButtons.vue";

console.log("DangerResultPage loaded");
</script>

<style scoped></style>
