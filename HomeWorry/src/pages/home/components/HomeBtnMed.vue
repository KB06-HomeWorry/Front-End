<template>
  <button class="btn-lgshort-wrapper bodyMedium12px" @click="$emit('click')">
    <div class="btn-content">
      <img v-if="icon" :src="icon" alt="icon" class="btn-icon" />
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
.btn-lgshort-wrapper {
  border-radius: 12px;
  width: 174px;
  height: 55px;
  text-align: center;
  padding: 0;
  background-color: #ffffff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-primary);
  transition: all 0.1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center; /* 버튼 내 중앙정렬 */
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px; /* 이미지-텍스트 간격 */
}

.btn-text {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 0;
  line-height: 55px;
  margin-top: 2px;
}

.btn-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  filter: drop-shadow(0 3px 3px rgba(0,0,0,0.25));
}

.btn-lgshort-wrapper:hover {
  border: 1.2px solid var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-05);
}
</style>
