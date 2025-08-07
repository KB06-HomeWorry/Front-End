<template>
  <div class="button-group">
    <BtnMedSlim
      :text="
        isLoading
          ? `AI가 분석 중... (${totalCount}개 파일)`
          : `AI로 ${totalCount}개 계약서 분석하기`
      "
      :disabled="isLoading"
      @click="emit('analyze')"
      class="group-btn"
    />
    <BtnMedSlim
      text="점검 다시하기"
      @click="emit('reset')"
      color="#fff"
      class="group-btn"
    />
  </div>
</template>

<script setup>
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';

const props = defineProps({
  isLoading: Boolean,
  totalCount: Number,
});
const emit = defineEmits(['analyze', 'reset']);
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  width: 100%;
}

.group-btn {
  width: 100%;
}
</style>
