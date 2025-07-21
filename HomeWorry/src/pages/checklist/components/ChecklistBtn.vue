<template>
  <div class="button-group">
    <div class="left">
      <BtnSm
        v-if="currentStep > 1"
        text="이전 단계"
        color="#ffffff"
        iconPosition="left"
        @click="goPrev"
      />
    </div>

    <div class="center">
      <BtnSm text="저장하기" color="var(--color-primary)" @click="save" />
    </div>

    <div class="right" style="text-align: right">
      <BtnSm
        v-if="currentStep < maxStep"
        text="다음 단계"
        color="#ffffff"
        iconPosition="right"
        @click="goNext"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useChecklistStep } from '@/composables/useChecklistStep';
import BtnSm from '@/components/button/BtnSm.vue';
import { useChecklistStore } from '@/stores/checklist';

const checklistStore = useChecklistStore();

const props = defineProps({
  currentStep: Number,
  maxStep: Number,
});

const { setStageByIndex } = useChecklistStep();
const emit = defineEmits(['update:currentStep', 'save']);
const router = useRouter();

const goPrev = () => {
  if (props.currentStep > 1) {
    const newStep = props.currentStep - 1;
    setStageByIndex(newStep - 1);
    emit('update:currentStep', newStep);
  }
};

const goNext = () => {
  if (props.currentStep < props.maxStep) {
    const newStep = props.currentStep + 1;
    setStageByIndex(newStep - 1);
    emit('update:currentStep', newStep);
  }
};

const save = () => {
  emit('save');

  const type = checklistStore.checklistData.type;
  const stage = checklistStore.checklistData.stage;
  const user_id = checklistStore.checklistData.userId;

  router.push({
    path: '/dangerResult',
    query: {
      type,
      stage,
      user_id,
    },
  });
};
</script>

<style scoped>
.button-group {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin: 28px;
  gap: 16px; /* 버튼 간격 */
}

.left {
  display: flex;
  justify-content: flex-start;
}

.center {
  display: flex;
  justify-content: center;
}

.right {
  display: flex;
  justify-content: flex-end;
}
</style>
