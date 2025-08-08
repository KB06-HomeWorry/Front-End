<template>
  <div class="result-card">
    <div
      class="info-trigger"
      @mouseenter="isInfoOpen = true"
      @mouseleave="isInfoOpen = false"
      @focus="isInfoOpen = true"
      @blur="isInfoOpen = false"
      tabindex="0"
    >
      <img
        class="result-image"
        :src="dangerResultStore.imageUrl"
        alt="위험도 이미지"
      />
      <div v-if="isInfoOpen" class="info-box bodyLight12px">
        {{ infoText }}
      </div>
    </div>

    <div class="result-info">
      <span class="grade-pill titleBold20px">
        {{ dangerResultStore.grade }}
      </span>
      <p class="message bodyMedium16px">{{ dangerResultStore.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { useDangerResultStore } from "@/stores/dangerResult";
import { ref, computed } from "vue";

import riskHigh from "@/assets/icons/risk_high.png";
import riskMedium from "@/assets/icons/risk_medium.png";
import riskLow from "@/assets/icons/risk_low.png";
import riskVeryHigh from "@/assets/icons/risk_veryhigh.png";

const dangerResultStore = useDangerResultStore();
const isInfoOpen = ref(false);

const infoText = computed(() => {
  switch (dangerResultStore.grade) {
    case "VeryHigh":
      return "거래에 매우 높은 위험이 감지되었습니다. 계약에 주의가 필요합니다.";
    case "High":
      return "위험도가 높은 편입니다. 계약 조건을 신중히 확인하세요.";
    case "Medium":
      return "일부 유의사항이 있으므로 계약 전 확인이 필요합니다.";
    case "Low":
      return "위험도는 낮지만, 모든 계약은 주의가 필요합니다.";
    default:
      return "위험도 정보를 확인 중입니다.";
  }
});
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  background-color: #eeeff666;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  gap: 16px;
  max-width: 430px;
  margin: 0 auto;
}

.result-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.grade-pill {
  background-color: #ef5957;
  color: white;
  padding: 6px 18px;
  border-radius: 20px;
}

.message {
  color: #f37878;
  margin-top: 4px;
}

.info-trigger {
  position: relative;
  display: inline-block;
  outline: none;
}

.result-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  cursor: pointer;
}

.info-box {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translate(-50%, -100%);
  min-width: 250px;
  max-width: 350px;
  background: var(--color-white);
  color: var(--color-black);
  border-radius: 12px;
  padding: 12px 14px;
  white-space: pre-line;
  z-index: 10;
  border: 0.5px solid var(--color-mediumgray);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.17s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
