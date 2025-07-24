<template>
  <div class="property-risk-check">
    <InputSelect
      label="거래 유형"
      :options="dealTypeOptions"
      v-model="dealType"
      placeholder="거래 유형을 선택해주세요."
      desc="•입력한 거래가는 선택한 거래 유형(전세/월세/매매)을 기준으로 분석됩니다."
    />
    <InputField
      label="거래가"
      :placeholder="dealPricePlaceholder"
      v-model="dealPrice"
      desc="•입력한 거래가를 기반으로 주변 시세와 비교해 과도한 고가 거래 또는 저가 거래 여부를 분석해 매물의 리스크 가능성을 판단할 수 있습니다."
      type="text"
    />
    <ToggleOptionGroup
      label="옵션"
      :options="optionList"
      v-model="selectedOptions"
      desc="•선택한 옵션이 평균적인 매물에 비해 지나치게 많거나 적을 경우, 허위 매물 가능성을 판단하는 데 참고할 수 있습니다."
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputField from '@/components/input/InputField.vue';
import InputSelect from '@/components/input/InputSelect.vue';
import ToggleOptionGroup from '@/components/input/ToggleOptionGroup.vue';

const dealType = ref('');
const dealPrice = ref('');
const selectedOptions = ref([]);

const dealPricePlaceholder = computed(() => {
  switch (dealType.value) {
    case '전세':
      return '예: 2억 5천';
    case '월세':
      return '예: 보증금 1,000 / 월세 80';
    case '매매':
      return '예: 3억 5천';
    default:
      return '거래가를 입력해주세요.';
  }
});

const dealTypeOptions = [
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
  { label: '매매', value: '매매' },
];

const optionList = [
  { label: '에어컨', value: 'air_conditioner' },
  { label: '세탁기', value: 'washer' },
  { label: '건조기', value: 'dryer' },
  { label: '냉장고', value: 'refrigerator' },
  { label: '책상', value: 'desk' },
  { label: '침대', value: 'bed' },
  { label: '옷장', value: 'closet' },
  { label: '신발장', value: 'shoe_rack' },
  { label: '기타', value: 'etc' },
];
</script>

<style scoped>
.property-risk-check {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
</style>
