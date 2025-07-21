<template>
  <div>
    문제
    <ul>
      <li
        v-for="item in checklist"
        :key="item.questionId"
        style="margin-bottom: 16px"
      >
        <div id="checklist-content">
          <div id="checklist-box">
            <input
              type="checkbox"
              :checked="getChecked(item)"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.questionId"
            />
            <label :for="'checklist-' + item.questionId"> </label>
          </div>
          <div id="checklist-question">{{ item.content }}</div>
        </div>

        <div>{{ item.effectiveness }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useChecklistStore } from '@/stores/checklist';

const checklistStore = useChecklistStore();

const checklist = ref([]);
const answerlist = ref([]);

const loadChecklist = async () => {
  const { type, stage, userId } = checklistStore.checklistData;

  try {
    const response = await axios.get('http://localhost:8080/checklist', {
      params: { type, stage, user_id: userId },
    });

    const data = response.data;

    console.log('API 응답 전체:', data);
    if (!data || !Array.isArray(data.checklist)) {
      console.error('Invalid checklist data:', data);
      checklist.value = [];
      answerlist.value = [];
      return;
    }

    checklist.value = data.checklist;
    answerlist.value = data.answers || [];

    checklist.value = data.checklist.map((item) => {
      const answer = data.answers?.find(
        (ans) => ans.questionId === item.checklistId
      );
      return {
        ...item,
        questionId: item.checklistId,
        checked: answer ? Boolean(answer.answer) : false,
      };
    });

    checklistStore.checklist = checklist.value;
  } catch (error) {
    console.error('Checklist load error:', error);
    checklist.value = [];
    answerlist.value = [];
  }
};

function getChecked(item) {
  return item.checked || false;
}

function onCheckChange(event, item) {
  const checked = event.target.checked;
  item.checked = checked;

  const answerObj = answerlist.value.find(
    (answer) => answer.questionId === item.questionId
  );

  if (answerObj) {
    answerObj.answer = checked;
  } else {
    answerlist.value.push({
      questionId: item.questionId,
      userId: checklistStore.checklistData.userId,
      answer: checked,
    });
  }
}

onMounted(loadChecklist);

watch(
  () => [checklistStore.checklistData.type, checklistStore.checklistData.stage],
  loadChecklist
);
</script>

<style scoped></style>
