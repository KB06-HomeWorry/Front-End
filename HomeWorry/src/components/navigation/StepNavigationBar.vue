<template>
  <div class="step-container">
    <div v-for="(step, index) in steps" :key="index" class="step">
      <button
        class="circle bodyMedium24px"
        :class="[
          mode,
          {
            active: currentStep === index + 1,
            completed: currentStep > index + 1,
          },
        ]"
        @click="handleStepClick(index + 1, step)"
        :aria-label="`단계 ${index + 1}: ${step}`"
      >
        {{ index + 1 }}
      </button>
      <div class="label bodyMedium10px2">{{ step }}</div>
      <div
        v-if="index !== steps.length - 1"
        class="line"
        :class="[{ completed: currentStep > index + 1 }, mode]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    default: 'checklist',
  },
});

const emit = defineEmits(['update:currentStep', 'stageChange']);

function handleStepClick(stepNumber, stepName) {
  emit('update:currentStep', stepNumber);
  emit('stageChange', stepNumber - 1, stepName);
}
</script>

<style scoped>
.step-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: none;
  transition: var(--transition);
}

/* 기본 비활성화 스타일 */
.circle.checklist,
.circle.analysis {
  background-color: var(--color-lightgray2);
  color: var(--color-light);
}

/* checklist용 활성/완료 스타일 */
.circle.checklist.active,
.circle.checklist.completed {
  background-color: var(--color-secondarylight);
  color: var(--color-primary);
}

/* analysis용 활성/완료 스타일 */
.circle.analysis.active,
.circle.analysis.completed {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.line {
  position: absolute;
  top: 27px;
  left: 50%;
  width: 100%;
  height: 6px;
  background-color: var(--color-lightgray2);
  z-index: 0;
  transition: var(--transition);
}

/* checklist용 선 완료 스타일 */
.line.checklist.completed {
  background-color: var(--color-secondarylight);
}

/* analysis용 선 완료 스타일 */
.line.analysis.completed {
  background-color: var(--color-primary);
}

.label {
  padding-top: 4px;
  color: var(--color-dark);
  text-align: center;
}
</style>
