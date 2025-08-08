import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reactive } from 'vue';
import riskHigh from '@/assets/icons/risk_high.png';
import riskMedium from '@/assets/icons/risk_medium.png';
import riskLow from '@/assets/icons/risk_low.png';
import riskVeryHigh from '@/assets/icons/risk_veryhigh.png';

export const useDangerResultStore = defineStore('dangerResult', () => {
  const grade = ref('Low');
  const message = ref('위험 낮음');
  const descriptionTitleList = ref(['']);
  const descriptionContentList = ref(['']);
  const imageUrl = ref('');

  const imageMap = {
    VeryHigh: riskVeryHigh,
    High: riskHigh,
    Medium: riskMedium,
    Low: riskLow,
  };

  function setDangerResult(
    newgrade,
    newmessage,
    newdescriptionTitle,
    newdescriptionContent,
    newimageUrl
  ) {
    // console.log(newdescriptionContent);

    // 상태 업데이트
    grade.value = newgrade;
    message.value = newmessage;
    descriptionTitleList.value = newdescriptionTitle;
    descriptionContentList.value = newdescriptionContent;
    imageUrl.value = imageMap[newgrade] ?? ''; // fallback 처리
  }

  return {
    grade,
    message,
    descriptionTitleList,
    descriptionContentList,
    imageUrl,
    setDangerResult,
  };
});
