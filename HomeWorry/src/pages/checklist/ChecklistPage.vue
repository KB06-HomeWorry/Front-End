<template>
  <ChecklistNavBar v-model:currentStep="currentStep" />
  체크리스트
  <ChecklistQuestion />
  <ChecklistBtn
    :currentStep="currentStep"
    :maxStep="4"
    @update:currentStep="(val) => (currentStep = val)"
  />
</template>

<script setup>
import ChecklistNavBar from './components/ChecklistNavBar.vue';
import ChecklistQuestion from './components/ChecklistQuestion.vue';
import ChecklistBtn from './components/ChecklistBtn.vue';

import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();

const currentStep = ref(1);
</script>

<style scoped></style>
