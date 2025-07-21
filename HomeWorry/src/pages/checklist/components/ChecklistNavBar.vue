<template>
  <div class="step-container">
    <div v-for="(step, index) in steps" :key="index" class="step">
      <button
        class="circle bodyMedium24px"
        :class="{
          active: currentStep === index + 1,
          completed: currentStep > index + 1,
        }"
        @click="handleStepClick(index + 1, step)"
        :aria-label="`단계 ${index + 1}: ${step}`"
      >
        {{ index + 1 }}
      </button>
      <div class="label bodyMedium10px">{{ step }}</div>
      <div
        v-if="index !== steps.length - 1"
        class="line"
        :class="{ completed: currentStep > index + 1 }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useChecklistStep } from "@/composables/useChecklistStep";

const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:currentStep"]);

const { steps, setStageByIndex } = useChecklistStep();

function handleStepClick(stepNumber, stepName) {
  emit("update:currentStep", stepNumber);
  setStageByIndex(stepNumber - 1);
  console.log("선택된 stage:", stepName);
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
  background-color: var(--color-lightgray2);
  color: var(--color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: none;
  transition: var(--transition);
}

.circle.active,
.circle.completed {
  background-color: var(--color-secondarylight);
  color: var(--color-primary);
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

.line.completed {
  background-color: var(--color-secondarylight);
}

.label {
  padding-top: 4px;
}
</style>
