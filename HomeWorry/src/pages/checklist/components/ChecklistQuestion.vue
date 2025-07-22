<template>
  <div class="checklist-container">
    <ul>
      <li
        v-for="item in checklistStore.checklist"
        :key="item.questionId"
        style="margin-bottom: 16px"
      >
        <div class="checklist-content">
          <div class="checklist-box">
            <input
              type="checkbox"
              :checked="item.checked"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.questionId"
            />
            <label :for="'checklist-' + item.questionId"></label>
          </div>
          <div class="checklist-question">{{ item.content }}</div>
        </div>
        <div>{{ item.effectiveness }}</div>
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
.checklist-box input[type='checkbox']:focus {
  accent-color: var(--color-secondarylight);
}

.checklist-box input[type='checkbox']:checked {
  accent-color: var(--color-secondarylight);
}

.checklist-box input[type='checkbox']:checked:hover,
.checklist-box input[type='checkbox']:checked:focus {
  accent-color: var(--color-secondarylight);
}

.checklist-box label {
  width: 22px;
  height: 22px;
  display: inline-block;
}

.checklist-question {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.35;
  margin: 0;
}

li > div:last-child {
  font-size: 14px;
  color: #555;
  margin-left: 45px;
  margin-right: 10px;
  margin-top: 7px;
}
</style>
