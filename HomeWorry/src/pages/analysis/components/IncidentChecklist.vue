<template>
  <li
    v-for="item in questionList"
    :key="item.questionId ?? item.key"
    style="margin-bottom: 16px"
    class="incident-checklist"
  >
    <div class="checklist-content">
      <div class="checklist-box">
        <input
          type="checkbox"
          v-model="localAnswers[item.questionId ?? item.key]"
          :id="'incident-check-' + (item.questionId ?? item.key)"
        />
        <label
          :for="'incident-check-' + (item.questionId ?? item.key)"
          class="bodyMedium16px"
        >
          {{ item.label }}
        </label>
      </div>
    </div>
    <div v-if="item.desc" class="bodyLight12px">•{{ item.desc }}</div>
  </li>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  questionList: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localAnswers = reactive({});

watch(
  () => props.questionList,
  (newList) => {
    if (!Array.isArray(newList)) return;
    newList.forEach((item) => {
      const id = item.questionId ?? item.key;
      if (!(id in localAnswers)) {
        localAnswers[id] = props.modelValue?.[id] ?? false;
      }
    });
  },
  { immediate: true }
);

watch(
  localAnswers,
  (val) => {
    emit('update:modelValue', { ...val });
  },
  { deep: true }
);
</script>

<style scoped>
.incident-checklist {
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

.checklist-box label {
  cursor: pointer;
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
