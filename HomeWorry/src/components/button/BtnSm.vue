<template>
  <button
    class="btn-sm-wrapper bodyMedium16px"
    :class="{ 'white-bg': isWhiteBg }"
    :style="{ backgroundColor: isWhiteBg ? '#ffffff' : 'var(--color-primary)' }"
    @click="$emit('click')"
  >
    <template v-if="iconPosition === 'left'">
      <img src="@/assets/icons/back.png" class="icon icon-left" />
    </template>

    <span class="text">{{ text }}</span>

    <template v-if="iconPosition === 'right'">
      <img src="@/assets/icons/back.png" class="icon icon-right flip" />
    </template>
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
  iconPosition: {
    type: String,
    default: '',
  },
});

defineEmits(['click']);

const isWhiteBg = computed(() => {
  const c = props.color?.toLowerCase();
  return c === '#fff' || c === '#ffffff' || c === 'white';
});
</script>

<style scoped>
.btn-sm-wrapper {
  border-radius: 12px;
  width: 105px;
  height: 50px;
  padding: 0;
  border: none;
  color: var(--color-white);
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
}

.white-bg {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.icon {
  width: 25px;
  height: 25px;
}

.icon-left {
  margin-left: -8px;
}

.icon-right {
  margin-right: -8px;
}

.flip {
  transform: scaleX(-1);
}

.text {
  position: relative;
  top: 1px;
}
</style>
