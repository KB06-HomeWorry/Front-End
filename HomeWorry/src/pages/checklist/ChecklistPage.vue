<template>
  <br />
  <ChecklistNavBar v-model:currentStep="currentStep" />
  <br />
  <ChecklistQuestion />
  <br /><br /><br /><br />

  <div class="fixed-footer-btn">
    <ChecklistBtn
      :currentStep="currentStep"
      :maxStep="4"
      @update:currentStep="(val) => (currentStep = val)"
      @save="handleSaveRequested"
    />
  </div>
</template>

<script setup>
import ChecklistNavBar from './components/ChecklistNavBar.vue';
import ChecklistQuestion from './components/ChecklistQuestion.vue';
import ChecklistBtn from './components/ChecklistBtn.vue';

import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

import { useChecklistStore } from '@/stores/checklist';
import { useChecklistStep } from '@/composables/useChecklistStep';
import { useRouter } from 'vue-router';
const router = useRouter();

const route = useRoute();
const checklistStore = useChecklistStore();
const { setStageByIndex } = useChecklistStep();

const currentStep = ref(1);

onMounted(async () => {
  const { type, stage, userId } = route.query;
  if (type && stage && userId) {
    checklistStore.checklistData.type = type;
    checklistStore.checklistData.stage = stage;
    checklistStore.checklistData.userId = parseInt(userId);
    console.log('스토어 초기화 완료:', checklistStore.checklistData);
  }

  await checklistStore.loadChecklist();
});

watch(currentStep, (newStep) => {
  setStageByIndex(newStep - 1);
});

async function handleSaveRequested() {
  try {
    const userId = checklistStore.checklistData.userId;

    const answerDTOList = checklistStore.checklist.map((item) => ({
      questionId: item.questionId,
      userId,
      answer: item.checked || false,
    }));

    console.log('저장할 데이터:', answerDTOList);

    const type = checklistStore.checklistData.type;
    const stage = checklistStore.checklistData.stage;
    const user_id = checklistStore.checklistData.userId;

    alert(
      `${stage} 단계의 모든 답변을 저장했어요😊\n이제 결과를 확인해볼까요?`
    );
    await axios.post('http://localhost:8080/checklist/answers', answerDTOList);

    router.push({
      path: '/dangerResult',
      query: {
        type,
        stage,
        user_id,
      },
    });
  } catch (error) {
    console.error('저장 실패:', error);
    alert('저장에 실패했습니다.');
  }
}
</script>

<style scoped>
.fixed-footer-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px;
  z-index: 100;
  padding: 12px 0 18px 0;
  display: flex;
  justify-content: center;
}
</style>
