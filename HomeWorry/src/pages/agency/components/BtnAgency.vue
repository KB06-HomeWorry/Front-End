<template>
  <button
    class="btn-med-wrapper bodyMedium14px"
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
  width: 160px;
  height: 35px;
  text-align: center;
  padding: 0;
  line-height: 35px;
  border: none;
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
}

.white-bg {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
