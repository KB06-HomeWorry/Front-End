<template>
  <button
    class="listing-btn bodyMedium12px"
    :class="{ active: visible }"
    @click="toggle"
  >
    {{ visible ? '매물' : '매물' }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['toggle']);

function toggle() {
  emit('toggle');
}
</script>

<style scoped>
.listing-btn {
  height: 30px;
  line-height: 16px;
  position: relative;
  top: 20px;
  left: 330px;
  z-index: 10;
  background-color: white;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.listing-btn.active {
  background-color: var(--color-primary);
  color: white;
}
</style>