<template>
  <div class="checklist-container">
    <ProgressBar
      :percent="progressPercent"
      :label="`${checkedCount} / ${totalCount}`"
    />
    <ul class="checklist-list">
      <li
        v-for="item in checklistStore.checklist"
        :key="item.questionId"
        :class="['checklist-item', { checked: item.checked }]"
        @click="toggleCheck(item)"
      >
        <div class="checklist-content">
          <div class="checklist-question bodyMedium16px">
            <div class="question-row">
              <div
                v-if="checklistStore.topFiveAnswers.includes(item.checklistId)"
                class="hot-badge-wrapper"
                @mouseenter="hoveredId = item.checklistId"
                @mouseleave="hoveredId = null"
                tabindex="0"
              >
                <span>⚠️</span>
                <div
                  v-if="hoveredId === item.checklistId"
                  class="info-box bodyLight12px"
                >
                  많은 사용자가 체크하지 않아 위험 가능성이 높은 질문입니다.
                </div>
              </div>
              <div>{{ item.content }}</div>
            </div>
          </div>
          <div class="effectiveness-text bodyLight12px">
            * {{ item.effectiveness }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue';
import { useChecklistStore } from '@/stores/checklist';
import ProgressBar from '@/pages/agency/components/ProgressBar.vue';

const checklistStore = useChecklistStore();
const emit = defineEmits(['progress-full']);
const hasEmitted = ref(false);
const hoveredId = ref(null);

function toggleCheck(item) {
  item.checked = !item.checked;

  const existing = checklistStore.answerList.find(
    (ans) => ans.questionId === item.questionId
  );

  if (existing) {
    existing.answer = item.checked;
  } else {
    checklistStore.answerList.push({
      questionId: item.questionId,
      userId: checklistStore.checklistData.userId,
      answer: item.checked,
    });
  }
}

const checkedCount = computed(
  () => checklistStore.checklist.filter((item) => item.checked).length
);

const totalCount = computed(() => checklistStore.checklist.length);

const progressPercent = computed(() =>
  totalCount.value === 0 ? 0 : (checkedCount.value / totalCount.value) * 100
);

watch(progressPercent, (newVal) => {
  if (newVal === 100 && !hasEmitted.value) {
    emit('progress-full');
    hasEmitted.value = true;
  }
});

onMounted(() => {
  checklistStore.loadChecklist();
  hasEmitted.value = false;
});

watch(() => [
  checklistStore.checklistData.type,
  checklistStore.checklistData.stage,
]);

watch(() => checklistStore.loadChecklist());
</script>

<style scoped>
.checklist-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.checklist-list {
  width: 330px;
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.checklist-item {
  height: 100px;
  overflow: visible;
  border: 0.5px solid var(--color-secondarylight);
  border-radius: 12px;
  background-color: #fff0f3;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.checklist-item.checked {
  background-color: #ffffff;
  border: 0.5px solid #999999;
  color: var(--color-mediumgray);
}

.checklist-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  justify-content: center;
}

.checklist-question {
  line-height: 1.4;
}

.checklist-item.checked .checklist-question {
  text-decoration: line-through;
}

.effectiveness-text {
  line-height: 1.2;
  word-break: keep-all;
  color: inherit;
  opacity: 0.8;
}

.question-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hot-badge-wrapper {
  position: relative;
}

.info-box {
  position: absolute;
  bottom: 125%;
  background-color: var(--color-white);
  color: var(--color-black);
  border-radius: 12px;
  padding: 10px 14px;
  line-height: 1.4;
  white-space: pre-line;
  border: 0.5px solid var(--color-mediumgray);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  min-width: 240px;
  max-width: 340px;
  pointer-events: none;
}
</style>
