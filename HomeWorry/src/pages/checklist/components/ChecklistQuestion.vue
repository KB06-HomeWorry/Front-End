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
                v-if="
                  checklistStore.topFiveAnswers.some(
                    (ans) => ans === item.checklistId
                  )
                "
                class="hot-badge"
              >
                🙊
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
import { computed, onMounted, watch, ref } from "vue";
import { useChecklistStore } from "@/stores/checklist";
import ProgressBar from "@/pages/agency/components/ProgressBar.vue";

const checklistStore = useChecklistStore();
const emit = defineEmits(["progress-full"]);
const hasEmitted = ref(false);

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
    emit("progress-full");
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
  overflow: hidden;
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
  display: flex;
  align-items: center;
}

.hot-badge {
  position: relative;
  color: red;
  font-weight: bold;
  cursor: pointer;
}

/* hover 시 tooltip 표시 */
.hot-badge::after {
  content: "이 문항은 최근 많이 틀린 질문입니다.";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.hot-badge:hover::after {
  opacity: 1;
}
</style>
