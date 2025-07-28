<template>
  <div class="title bodyMedium20px">표제부 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="addressQuestions"
    v-model="answers.address"
  />
  <br />
  <div class="title bodyMedium20px">갑구(소유권) 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="ownershipQuestions"
    v-model="answers.ownership"
  />
  <br />
  <div class="title bodyMedium20px">을구(권리 관계) 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="collateralQuestions"
    v-model="answers.collateral"
  />
</template>

<script setup>
import { reactive, watch } from 'vue';
import IncidentChecklist from '../components/IncidentChecklist.vue';
import { useAnalysisStore } from '@/stores/analysis.js';
import { storeToRefs } from 'pinia';

const store = useAnalysisStore();
const { registerCertifiedCount, checklistAnswers } = storeToRefs(store);

const answers = reactive(checklistAnswers.value);

const addressQuestions = [
  {
    key: 'addressMatch',
    label: '건물 또는 토지의 소재지가 정확한가요?',
    desc: '등기부 표제부의 소재지가 계약서와 일치하는지 확인하세요.',
  },
  {
    key: 'structureMatch',
    label: '지번, 면적, 용도가 계약서와 일치하나요?',
    desc: '면적, 건물 구조 및 용도가 계약서와 다르지 않은지 확인하세요.',
  },
  {
    key: 'issueDateMatch',
    label: '등기부 발급일자와 계약일자가 일치하나요?',
    desc: '발급일자와 계약일자가 다르면 주의가 필요합니다.',
  },
];

const ownershipQuestions = [
  {
    key: 'ownerMatch',
    label: '현재 소유자가 매도인과 일치하나요?',
    desc: '갑구 최종 소유자가 실제 매도인과 일치하는지 확인하세요.',
  },
  {
    key: 'restrictions',
    label: '가압류 등 제한사항이 있나요?',
    desc: '가압류, 경매 개시 등 소유권 제한 여부를 확인하세요.',
  },
];

const collateralQuestions = [
  {
    key: 'mortgageInfo',
    label: '근저당권이 설정되어 있나요?',
    desc: '을구에 설정된 근저당권 내역을 확인하세요.',
  },
  {
    key: 'otherRights',
    label: '기타 권리(전세권, 임차권 등)가 있나요?',
    desc: '타인의 권리가 설정되어 있다면 권리자와 협의가 필요합니다.',
  },
];

watch(
  () => answers,
  (newVal) => {
    let count = 0;
    Object.values(newVal).forEach((section) => {
      Object.values(section).forEach((value) => {
        if (value) count++;
      });
    });
    registerCertifiedCount.value = count;
    checklistAnswers.value = JSON.parse(JSON.stringify(newVal));
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.title {
  color: var(--color-primary);
}
</style>
