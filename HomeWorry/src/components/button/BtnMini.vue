<template>
  <button
    class="btn-mini-wrapper bodyMedium12px"
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
.btn-mini-wrapper {
  border-radius: 12px;
  width: 58px;
  height: 24px;
  text-align: center;
  padding: 0;
  line-height: 26px;
  border: none;
  color: var(--color-white);
  letter-spacing: -0.03em;
}

.white-bg {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
