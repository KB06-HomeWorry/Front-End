<template>
  <div class="price-box" @click="$emit('click')">
    <div class="top-section bodyMedium10px">
      <span class="top-text">{{ housingType || '-' }}</span>
    </div>
    <div class="divider"></div>
    <div class="bottom-section titleBold12px">
      <span class="bottom-text">{{ formattedPrice }}~</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  price: { type: [String, Number], required: true },
  housingType: { type: String, default: '' },
});

const formattedPrice = computed(() => formatKoreanPrice(props.price));

function formatKoreanPrice(price) {
  const num = Number(String(price).replace(/[^0-9]/g, ''));
  if (isNaN(num) || num === 0) return '-';
  const eok = num / 100000000;
  // 정수면 .0 안 붙임, 소수는 첫째 자리까지 표시
  if (eok % 1 === 0) return `${eok}억`;
  return `${parseFloat(eok.toFixed(1))}억`;
}
</script>

<style scoped>
.price-box {
  width: auto;
  min-width: 65px;
  height: 45px;
  border: 1.3px solid var(--color-primary);
  border-radius: 12px 12px 12px 0;
  background: var(--color-white);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 7px rgba(60, 60, 120, 0.07);
  cursor: pointer;
}

.top-section {
  background: rgba(17, 31, 92, 0.1);
  height: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 3px;
}

.divider {
  height: 1.3px;
  width: 100%;
  background: var(--color-primary);
  margin: 0;
}

.bottom-section {
  background: var(--color-white);
  height: 60%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
}

.top-text {
  color: var(--color-primary);
}

.bottom-text {
  color: var(--color-primary);
  letter-spacing: -0.5px;
}
</style>
