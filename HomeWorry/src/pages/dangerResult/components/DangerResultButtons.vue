<template>
  <div class="button-group">
    <BtnMedSlim
      text="분석 결과 이미지 저장"
      color="#ffffff"
      @click="saveAsImage"
    />

    <BtnMedSlim text="점검 다시하기" @click="checklistAgain()" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useChecklistStore } from '@/stores/checklist';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';
import html2canvas from 'html2canvas';

const router = useRouter();
const checklistStore = useChecklistStore();

const type = checklistStore.checklistData.type;
const stage = checklistStore.checklistData.stage;
const userId = checklistStore.checklistData.userId;

const props = defineProps({
  moveDefined: Number, // 0: 체크리스트 분석, 1: 서류 분석
});

// 이미지 저장 기능 (html2canvas 사용)
const saveAsImage = async () => {
  const target = document.querySelector('.result-page'); // 저장할 영역 선택
  if (!target) return alert('저장할 대상이 존재하지 않습니다.');

  try {
    const canvas = await html2canvas(target, { useCORS: true });
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'analysis_result.png';
    link.click();
  } catch (e) {
    console.error('이미지 저장 실패:', e);
    alert('이미지 저장에 실패했습니다.');
  }
};

const checklistAgain = () => {
  console.log('점검 다시하기 버튼 클릭');
  if (props.moveDefined === 0) {
    router.push({
      path: '/checklist',
      query: { type, stage, userId },
    });
  } else if (props.moveDefined === 1) {
    router.push('/analysis');
  }
};
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
