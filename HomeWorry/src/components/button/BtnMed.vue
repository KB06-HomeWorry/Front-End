<template>
  <button
    class="btn-med-wrapper bodyMedium20px"
    :class="{ 'white-bg': isWhiteBg }"
    :style="{ backgroundColor: isWhiteBg ? '#ffffff' : 'var(--color-primary)' }"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'var(--color-primary)',
  },
  text: {
    type: String,
    required: true,
  },
});

defineEmits(['click']);

const isWhiteBg = computed(() => {
  const c = props.color?.toLowerCase();
  return c === '#fff' || c === '#ffffff' || c === 'white';
});
</script>

<style scoped>
.btn-med-wrapper {
  border-radius: 12px;
  width: 330px;
  height: 50px;
  text-align: center;
  padding: 0;
  border: none;
  color: var(--color-white);
  transition: var(--transition);
}

.white-bg {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
