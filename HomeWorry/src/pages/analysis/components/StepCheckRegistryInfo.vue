<template>
  <div class="label-row">
    <label class="input-label bodyMedium20px">표제부 정보 확인</label>
    <HelpButton :message="documentInformationMessage" />
  </div>
  <br />
  <IncidentChecklist
    :questionList="addressQuestions"
    v-model="answers.address"
  />
  <br />
  <div class="label-row">
    <label class="input-label bodyMedium20px">갑구(소유권) 정보 확인</label>
    <HelpButton :message="ownerInformationMessage" />
  </div>
  <br />
  <IncidentChecklist
    :questionList="ownershipQuestions"
    v-model="answers.ownership"
  />
  <br />
  <div class="label-row">
    <label class="input-label bodyMedium20px">을구(권리 관계) 정보 확인</label>
    <HelpButton :message="collateralInformationMessage" />
  </div>
  <br />
  <IncidentChecklist
    :questionList="collateralQuestions"
    v-model="answers.collateral"
  />
</template>

<script setup>
import { reactive, watch } from "vue";
import { ref } from "vue";
import IncidentChecklist from "../components/IncidentChecklist.vue";
import { useAnalysisStore } from "@/stores/analysis.js";
import { storeToRefs } from "pinia";
import HelpButton from "@/components/button/HelpButton.vue";

const store = useAnalysisStore();
const { registerCertifiedCount, checklistAnswers } = storeToRefs(store);

import documentImage from "@/assets/images/documentInformation_image.png";
import ownerImage from "@/assets/images/ownerInformation_image.png";
import collateralImage from "@/assets/images/collateralInformation_image.png";

const documentInformationMessage = ref(`
  <img src="${documentImage}" alt="표제부 정보 이미지" style="width:auto; height:auto; margin-bottom:8px;" />
  표제부를 통해 부동산의 기본 정보를 확인하고 위치, 면적, 구조등을 파악합니다.
`);

const ownerInformationMessage = ref(`
  <img src="${ownerImage}" alt="소유권 정보 확인" style="width:auto; height:auto; margin-bottom:8px;" />
  갑구 확인을 통해 매물 소유자 관련 사항과 소유자 변동, 가압류, 경매 개시 여부를 알아봅니다.
`);

const collateralInformationMessage = ref(`
  <img src="${collateralImage}" alt="권리 관계 확인" style="width:auto; height:auto; margin-bottom:8px;" />
  을구를 통해 소유권 이외의 권리와 근저당권, 전세권, 임차권 등의 설정 여부를 확인합니다.
`);

const answers = reactive(checklistAnswers.value);

const addressQuestions = [
  {
    key: "addressMatch",
    label: "건물 또는 토지의 소재지가 정확한가요?",
    desc: "등기부 표제부의 소재지가 계약서와 일치하는지 확인하세요.",
  },
  {
    key: "structureMatch",
    label: "지번, 면적, 용도가 계약서와 일치하나요?",
    desc: "면적, 건물 구조 및 용도가 계약서와 다르지 않은지 확인하세요.",
  },
  {
    key: "issueDateMatch",
    label: "등기부 발급일자와 계약일자가 일치하나요?",
    desc: "발급일자와 계약일자가 다르면 주의가 필요합니다.",
  },
];

const ownershipQuestions = [
  {
    key: "ownerMatch",
    label: "현재 소유자가 매도인과 일치하나요?",
    desc: "갑구 최종 소유자가 실제 매도인과 일치하는지 확인하세요.",
  },
  {
    key: "restrictions",
    label: "가압류 등 제한사항이 있나요?",
    desc: "가압류, 경매 개시 등 소유권 제한 여부를 확인하세요.",
  },
];

const collateralQuestions = [
  {
    key: "mortgageInfo",
    label: "근저당권이 설정되어 있나요?",
    desc: "을구에 설정된 근저당권 내역을 확인하세요.",
  },
  {
    key: "otherRights",
    label: "기타 권리(전세권, 임차권 등)가 있나요?",
    desc: "타인의 권리가 설정되어 있다면 권리자와 협의가 필요합니다.",
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

.label-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.input-label {
  margin-bottom: -4px;
  display: block;
  color: var(--color-primary);
}
</style>
