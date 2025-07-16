<template>
  <ChecklistNavBar />
  체크리스트
  <ChecklistQuestion />
</template>

<script setup>
import ChecklistNavBar from "./components/ChecklistNavBar.vue";
import ChecklistQuestion from "./components/ChecklistQuestion.vue";
import { useRoute } from "vue-router";
import ChecklistPage from "@/pages/checklist/ChecklistPage.vue";
import { ref } from "vue";
const route = useRoute();
</script>
<style scoped></style>
