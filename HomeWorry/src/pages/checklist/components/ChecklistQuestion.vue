<template>
  <div>
    문제

    <ul>
      <li
        v-for="item in checklist"
        :key="item.checklistId"
        style="margin-bottom: 16px"
      >
        <div id="checklist-content">
          <div id="checklist-order">
            <strong>{{ item.orderNum }}</strong>
          </div>
          <div id="checklist-question">{{ item.content }}</div>
        </div>

        <div>{{ item.effectiveness }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { watch } from "vue";
import axios from "axios";
import { useChecklistStore } from "@/stores/checklist";
const checklistStore = useChecklistStore();

const checklist = ref([]);

const loadChecklist = async () => {
  const type = checklistStore.checklistData.type;
  const stage = checklistStore.checklistData.stage;
  console.log("Loading checklist for type:", type, "and stage:", stage);

  const { data } = await axios.get(`http://localhost:8080/checklist`, {
    params: { type, stage },
  });

  //   const params = new URLSearchParams({
  //     type: encodeURIComponent(type),
  //     stage: encodeURIComponent(stage),
  //   });

  //   const { data } = await axios.get(`/api/checklist?${params.toString()}`);
  console.log("Checklist data:", data);

  // 데이터가 유효한지 확인
  if (!data || !Array.isArray(data)) {
    console.error("Invalid checklist data:", data);
    return;
  }

  checklist.value = data;
};

onMounted(loadChecklist);

//type, stage가 바뀌면 다시 불러오기
watch(
  () => [checklistStore.checklistData.type, checklistStore.checklistData.stage],
  loadChecklist
);
</script>
<style scoped></style>
