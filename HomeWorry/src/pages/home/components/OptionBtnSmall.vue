<template>
  <button
    class="btn-med-wrapper bodyMedium16px"
    :class="{ 'selected': isSelected }"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['click']);
</script>

<style scoped>
.btn-med-wrapper {
  border-radius: 12px;
  width: 100px;
  height: 50px;
  text-align: center;
  padding: 0;
  line-height: 50px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-primary);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.btn-med-wrapper:hover {
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-10);
}
.btn-med-wrapper.selected {
  border: 1px solid var(--color-primary);
  background: var(--color-primary-10);
}
</style>
