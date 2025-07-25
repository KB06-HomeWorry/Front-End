<template>
  <div class="checklist-container">
    <ul>
      <li
        v-for="item in checklistStore.checklist"
        :key="item.questionId"
        style="margin-bottom: 16px"
      >
        <div class="checklist-content">
          <label :for="'checklist-' + item.questionId" class="checklist-box">
            <input
              type="checkbox"
              :checked="item.checked"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.questionId"
            />
            <span class="checklist-question bodyMedium16px">
              {{ item.content }}
            </span>
          </label>
        </div>
        <div class="effectiveness-text bodyLight12px">
          •{{ item.effectiveness }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useChecklistStore } from '@/stores/checklist';

const checklistStore = useChecklistStore();

function onCheckChange(event, item) {
  const checked = event.target.checked;
  item.checked = checked;

  const existing = checklistStore.answerList.find(
    (ans) => ans.questionId === item.questionId
  );

  if (existing) {
    existing.answer = checked;
  } else {
    checklistStore.answerList.push({
      questionId: item.questionId,
      userId: checklistStore.checklistData.userId,
      answer: checked,
    });
  }
}

onMounted(() => {
  checklistStore.loadChecklist();
});

watch(
  () => [checklistStore.checklistData.type, checklistStore.checklistData.stage],
  () => checklistStore.loadChecklist()
);
</script>

<style scoped>
.checklist-container {
  max-width: 600px;
  margin-left: 20px;
}

.checklist-content {
  display: flex;
  align-items: center;
}

.checklist-box {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.effectiveness-text {
  white-space: normal;
  word-break: keep-all;
}

.checklist-box input[type='checkbox'] {
  width: 22px;
  height: 22px;
  accent-color: var(--color-lightgray2);
  transform: scale(1.15);
  margin: 0;
  cursor: pointer;
  transition: accent-color 0.2s;
}

.checklist-box input[type='checkbox']:hover,
.checklist-box input[type='checkbox']:focus,
.checklist-box input[type='checkbox']:checked,
.checklist-box input[type='checkbox']:checked:hover,
.checklist-box input[type='checkbox']:checked:focus {
  accent-color: var(--color-secondarylight);
}

li > div:last-child {
  margin-left: 32px;
  margin-right: 10px;
  margin-top: 2px;
}
</style>
