<template>
  <button class="btn-lgshort-wrapper bodyMedium12px" @click="$emit('click')">
    <div class="btn-content">
      <img v-if="icon" :src="icon" alt="icon" class="btn-icon" />
      <span class="btn-text" v-html="text"></span>
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
  width: 114px;
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
  gap: 9px; /* 이미지-텍스트 간격 */
}

.btn-text {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 0;
  line-height: 1.1;
}

.btn-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  filter: drop-shadow(0 3px 3px rgba(0,0,0,0.25));
}

.btn-lgshort-wrapper:hover {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: rgba(17, 31, 92, 0.1);
}
</style>
