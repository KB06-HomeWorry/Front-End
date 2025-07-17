<template>
  <div>
    문제
    <ul>
      <li
        v-for="(item, index) in checklist"
        :key="item.checklistId"
        style="margin-bottom: 16px"
      >
        <div id="checklist-content">
          <div id="checklist-box">
            <input
              type="checkbox"
              :checked="getChecked(index)"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.checklistId"
            />
            <label :for="'checklist-' + item.checklistId"> </label>
          </div>
          <div id="checklist-question">{{ item.content }}</div>
        </div>

        <div>{{ item.effectiveness }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useChecklistStore } from "@/stores/checklist";
const checklistStore = useChecklistStore();

const checklist = ref([]);
const answerlist = ref([]);

const loadChecklist = async () => {
  const type = checklistStore.checklistData.type;
  const stage = checklistStore.checklistData.stage;
  const user_id = checklistStore.checklistData.userId;
  console.log("type:", type, "stage:", stage, "userId:", user_id);

  const { data } = await axios.get(`http://localhost:8080/checklist`, {
    params: { type, stage, user_id },
  });

  console.log(" data:", data);
  console.log("answerlist data:", data.answers);
  console.log("Checklist data:", data.checklist);

  // 데이터가 유효한지 확인
  if (!data || !Array.isArray(data.checklist)) {
    console.error("Invalid checklist data:", data);
    return;
  }

  checklist.value = data.checklist;
  answerlist.value = data.answers;
  console.log("Checklist loaded:", checklist.value);
  console.log(answerlist.value[0]);
};

function getChecked(questionId) {
  // answerlist에서 questionId에 해당하는 답변을 찾고, 그 answer 값이 true면 체크
  const found = answerlist.value[questionId].answer;
  return Boolean(found);
}

function onCheckChange(event, item) {
  // item에 checked 속성이 없다면 동적으로 추가
  item.checked = event.target.checked;
}

onMounted(loadChecklist);

//type, stage가 바뀌면 다시 불러오기
watch(
  () => [checklistStore.checklistData.type, checklistStore.checklistData.stage],
  loadChecklist
);
</script>
<style scoped></style>
