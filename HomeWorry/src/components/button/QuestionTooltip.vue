<template>
  <span
    class="tooltip-trigger"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
    @focus="isOpen = true"
    @blur="isOpen = false"
    tabindex="0"
  >
    <img class="question-icon" :src="questionIcon" alt="?" draggable="false" />
    <span v-if="isOpen" class="tooltip-box bodyLight12px">
      <slot />
    </span>
  </span>
</template>

<script setup>
import questionIcon from "@/assets/icons/question_circle_darkgray.png";
import { ref } from "vue";
const isOpen = ref(false);
</script>

<style scoped>
.tooltip-trigger {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  outline: none;
}

.question-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  vertical-align: middle;
  background: transparent;
  margin-left: 0.5px;
  margin-bottom: 1.5px;
}

.tooltip-box {
  position: absolute;
  left: 120%;
  top: 50%;
  transform: translateY(-50%);
  min-width: 230px;
  max-width: 340px;
  background: var(--color-white);
  color: var(--color-black);
  border-radius: 12px;
  padding: 12px 14px;
  white-space: pre-line;
  z-index: 10;
  border: 0.5px solid var(--color-mediumgray);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.17s;
}

.tooltip-box[style*="display: none"] {
  opacity: 0;
}

.tooltip-trigger:focus .tooltip-box {
  display: block;
  opacity: 1;
}
</style>
