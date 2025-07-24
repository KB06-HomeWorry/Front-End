<template>
  <div class="title bodyMedium20px">표제부 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="[
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
    ]"
    v-model="answers.address"
  />
  <br />
  <div class="title bodyMedium20px">갑구(소유권) 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="[
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
    ]"
    v-model="answers.ownership"
  />
  <br />
  <div class="title bodyMedium20px">을구(권리 관계) 정보 확인</div>
  <br />
  <IncidentChecklist
    :questionList="[
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
    ]"
    v-model="answers.collateral"
  />
</template>

<script setup>
import { reactive } from 'vue';
import IncidentChecklist from '../components/IncidentChecklist.vue';

const answers = reactive({
  address: {
    addressMatch: '',
    structureMatch: '',
    issueDateMatch: '',
  },
  ownership: {
    ownerMatch: '',
    restrictions: '',
  },
  collateral: {
    mortgageInfo: '',
    otherRights: '',
  },
});
</script>

<style scoped>
.title {
  margin-left: 20px;
  color: var(--color-primary);
}
</style>
