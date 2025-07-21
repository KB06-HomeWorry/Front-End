<template>
  <button
    class="btn-tiny-wrapper bodyMedium12px"
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
.btn-tiny-wrapper {
  border-radius: 12px;
  width: 96px;
  height: 24px;
  text-align: center;
  padding: 0;
  line-height: 26px;
  border: none;
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
  letter-spacing: -0.03em;
}

.white-bg {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
