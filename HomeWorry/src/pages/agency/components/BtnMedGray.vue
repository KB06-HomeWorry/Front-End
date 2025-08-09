<template>
  <button
    class="btn-med-wrapper bodyMedium16px"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
defineEmits(['click']);
</script>

<style scoped>
.btn-med-wrapper {
  border-radius: 12px;
  width: 329px;
  height: 60px;
  text-align: center;
  padding: 0;
  line-height: 35px;
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
</style>
