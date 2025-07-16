<template>
  <button class="btn-lg-wrapper titleBold20px" @click="$emit('click')">
    <div class="btn-content">
      <template v-if="icon">
        <img :src="icon" alt="icon" class="btn-icon" />
      </template>
      <span class="btn-text">{{ text }}</span>
    </div>
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
.btn-lg-wrapper {
  border-radius: 12px;
  width: 359px;
  height: 73px;
  text-align: center;
  padding: 0;
  line-height: 73px;
  background-color: #ffffff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-primary);
  transition: all 0.2s ease-in-out;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 16px;
}

.btn-text {
  text-align: left;
  height: 100%;
  display: flex;
  align-items: center;
}

.btn-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.btn-lg-wrapper:hover {
  border-color: var(--color-primary);
}
</style>
