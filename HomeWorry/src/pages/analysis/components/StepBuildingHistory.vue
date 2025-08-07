<template>
  <div class="address-form">
    <!-- 라벨과 ? 버튼 한 줄 -->
    <div class="label-row">
      <label class="input-label bodyMedium20px">매물 주소</label>
      <HelpButton :message="message" />
    </div>

    <!-- 주소 입력 필드 -->
    <InputField
      placeholder="주소를 검색해주세요."
      v-model="propertyAddress"
      desc="•매물 주소를 기반으로, 건축물대장에 등록된 구조, 용도 등의 정보를 자동으로 분석해, 불법 건축물 여부 등 부동산 거래 시 유의해야 할 위험 요소를 사전에 확인할 수 있습니다."
      :readonly="true"
      @click="handleOpenPostcode"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import InputField from "@/components/input/InputField.vue";
import { openPostcode } from "@/composables/usePostcode.js";
import { useAnalysisStore } from "@/stores/analysis.js";
import { storeToRefs } from "pinia";
import HelpButton from "@/components/button/HelpButton.vue";

const analysisStore = useAnalysisStore();
const { houseAddress } = storeToRefs(analysisStore);

const propertyAddress = ref(houseAddress.value);
const message = ref(
  "주소를 사용하여 건축물 대장에서 일치하는 건물을 찾고 불법건축물 여부를 판단합니다."
);

function handleOpenPostcode() {
  openPostcode((data) => {
    propertyAddress.value = data.address;
  });
}

watch(propertyAddress, (val) => {
  analysisStore.houseAddress = val;
});
</script>

<style scoped>
.address-form {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
