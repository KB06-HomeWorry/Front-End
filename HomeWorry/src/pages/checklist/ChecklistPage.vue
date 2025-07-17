<template>
  <ChecklistNavBar v-model:currentStep="currentStep" />
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
import { ref, onMounted } from 'vue';
import { useChecklistStore } from '@/stores/checklist';

const route = useRoute();
const checklistStore = useChecklistStore();

const currentStep = ref(1);

onMounted(() => {
  const { type, stage, userId } = route.query;
  if (type && stage && userId) {
    checklistStore.checklistData.type = type;
    checklistStore.checklistData.stage = stage;
    checklistStore.checklistData.userId = parseInt(userId);
    console.log('스토어 초기화 완료:', checklistStore.checklistData);
  }
});
</script>

<style scoped></style>
