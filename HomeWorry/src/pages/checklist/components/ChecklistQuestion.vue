<template>
  <div class="checklist-container">
    <ul>
      <li
        v-for="item in checklist"
        :key="item.questionId"
        style="margin-bottom: 16px"
      >
        <div class="checklist-content">
          <div class="checklist-box">
            <input
              type="checkbox"
              :checked="getChecked(item)"
              @change="onCheckChange($event, item)"
              :id="'checklist-' + item.questionId"
            />
            <label :for="'checklist-' + item.questionId"> </label>
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
  const { type, stage, userId } = checklistStore.checklistData;

  try {
    const response = await axios.get("http://localhost:8080/checklist", {
      params: { type, stage, user_id: userId },
    });

    const data = response.data;

    console.log("API 응답 전체:", data);
    if (!data || !Array.isArray(data.checklist)) {
      console.error("Invalid checklist data:", data);
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
    console.error("Checklist load error:", error);
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
