<template>
  <div class="number-button-group bodyLight12px">
    <button
      v-for="(label, idx) in labels"
      :key="idx"
      @click="handleClick(amounts[idx])"
      type="button"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  amounts: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['add']);

function handleClick(amount) {
  emit('add', amount);
}
</script>

<style scoped>
.number-button-group {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.number-button-group button {
  flex: 1;
  padding: 8px 0;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  cursor: pointer;
  background-color: var(--color-white);
  transition: background-color 0.2s ease;
  color: var(--color-text);
}

.number-button-group button:hover {
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
  background: rgba(17, 31, 92, 0.1);
}
</style>
