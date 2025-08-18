<template>
  <section v-if="scoreData" class="review-summary">
    <div class="summary-container row-wrap">
      <!-- 좌측 원형 게이지 -->
      <div class="summary-gauge">
        <CircularGauge :score="toFiveScale(scoreData.finalTrustScore)" :size="85" />
      </div>
      <!-- 우측 막대 차트 -->
      <div class="summary-right">
        <BarChart :metric-scores="scoreData.averageMetricScores" />
      </div>
    </div>
  </section>
</template>

<script setup>
import CircularGauge from '@/pages/agency/components/CircularGauge.vue'
import BarChart from '@/pages/agency/components/BarChart.vue'

defineProps({
  scoreData: {
    type: Object,
    default: () => null
  }
})

/* 0~100 점수를 0~5 점수로 변환하여 소수 첫째 자리로 반올림 */
function toFiveScale(score100) {
  return Math.round((score100 / 100) * 50) / 10
}
</script>

<style scoped>
.review-summary {
  margin-top: 10px;
  border-top: 1px solid var(--color-mediumgray);
  border-bottom: 1px solid var(--color-mediumgray);
  padding-right: 12px;
  padding-bottom: 16px;
}

.summary-container.row-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 16px;
}

/* 좌측 게이지 */
.summary-gauge {
  width: 110px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
}

/* 우측 차트 */
.summary-right {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 180px;
}
</style>