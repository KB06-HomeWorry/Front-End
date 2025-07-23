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

  <CustomModal
    v-model:modelValue="showModal"
    :message="`${checklistStore.checklistData.stage} 단계 답변이 저장되었어요😊\n결과를 확인해볼까요?`"
    @confirm="handleModalConfirm"
    @cancel="() => (showModal = false)"
  />
</template>

<script setup>
import ChecklistNavBar from './components/ChecklistNavBar.vue';
import ChecklistQuestion from './components/ChecklistQuestion.vue';
import ChecklistBtn from './components/ChecklistBtn.vue';
import CustomModal from '@/components/modal/CustomModal.vue';

import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

import { useChecklistStore } from '@/stores/checklist';
import { useChecklistStep } from '@/composables/useChecklistStep';

const router = useRouter();
const route = useRoute();
const checklistStore = useChecklistStore();
const { setStageByIndex } = useChecklistStep();

const currentStep = ref(1);
const showModal = ref(false);

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

    await axios.post('http://localhost:8080/checklist/answers', answerDTOList);

    // 저장 성공 → 모달 표시
    showModal.value = true;
  } catch (error) {
    console.error('저장 실패:', error);
    alert('저장에 실패했습니다.');
  }
}

// 모달에서 "확인" 눌렀을 때 실행
function handleModalConfirm() {
  const { type, stage, userId } = checklistStore.checklistData;
  router.push({
    path: '/dangerResult',
    query: {
      type,
      stage,
      user_id: userId,
    },
  });
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
