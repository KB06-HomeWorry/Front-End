<template>
  <button class="btn-lgshort-square" @click="$emit('click')">
    <img v-if="icon" :src="icon" alt="icon" class="btn-square-icon" />
    <span class="btn-square-text bodyMedium12px">{{ text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
});
defineEmits(['click']);
</script>

<style scoped>
.btn-lgshort-square {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #fff;
  border: 0.5px solid var(--color-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in-out;
  box-sizing: border-box;
}

.btn-lgshort-square:hover {
  border: 1px solid var(--color-primary);
  background: rgba(17, 31, 92, 0.05);
}

.btn-square-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 5px;
}

.btn-square-text {
    color: var(--color-primary);
  text-align: center;
  letter-spacing: -0.03em;
}
</style>
