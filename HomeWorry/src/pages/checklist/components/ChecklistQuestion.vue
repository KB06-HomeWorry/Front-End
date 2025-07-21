<template>
  <div class="checklist-container">
    <ul>
      <li
        v-for="(item, index) in checklist"
        :key="item.checklistId"
        style="margin-bottom: 16px"
      >
        <div class="checklist-content">
          <div class="checklist-box">
            <input
              type="checkbox"
              :checked="getChecked(index)"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.checklistId"
            />
            <label :for="'checklist-' + item.checklistId"> </label>
          </div>
          <div class="checklist-question">{{ item.content }}</div>
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

<style scoped>
.checklist-container {
  max-width: 600px;
  margin-left: 5px;
}

.checklist-content {
  display: flex;
  align-items: center;
}

.checklist-box {
  display: flex;
  align-items: center;
}

.checklist-box input[type="checkbox"] {
  width: 22px;
  height: 22px;
  accent-color: var(--color-lightgray2);
  transform: scale(1.15);
  margin: 0;
  cursor: pointer;
  transition: accent-color 0.2s;
}

/* ✔️ hover, focus 상태에도 동일하게 유지 */
.checklist-box input[type="checkbox"]:hover,
.checklist-box input[type="checkbox"]:focus {
  accent-color: var(--color-secondarylight);
}

.checklist-box input[type="checkbox"]:checked {
  accent-color: var(--color-secondarylight);
}

/* checked+hover도 동일하게 */
.checklist-box input[type="checkbox"]:checked:hover,
.checklist-box input[type="checkbox"]:checked:focus {
  accent-color: var(--color-secondarylight);
}

/* checked+hover도 동일하게 */
.checklist-box input[type="checkbox"]:checked:hover,
.checklist-box input[type="checkbox"]:checked:focus {
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
