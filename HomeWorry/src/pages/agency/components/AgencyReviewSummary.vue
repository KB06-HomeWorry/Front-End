<template>
  <section v-if="scoreData" class="review-summary">
    <!-- <h2 class="section-title titleBold16px">방문자 신뢰도</h2> -->
    <div class="summary-container row-wrap">
      <!-- 좌측 게이지 -->
      <div class="summary-gauge">
        <CircularGauge :score="toFiveScale(scoreData.finalTrustScore)" :size="85"/>
      </div>
      <!-- 우측 상세 바차트 등 -->
      <div class="summary-right">
        <BarChart :metric-scores="scoreData.averageMetricScores" />
      </div>
    </div>
  </section>
</template>

<script setup>
import CircularGauge from '@/pages/agency/components/CircularGauge.vue';
import BarChart from '@/pages/agency/components/BarChart.vue';

defineProps({
  scoreData: {
    type: Object,
    default: () => null, 
  },
});
function toFiveScale(score100) {
  return Math.round((score100 / 100) * 50) / 10;
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

.section-title {
  /* margin-bottom: 12px; */
  padding-left: 12px;
  color: var(--color-primary);
}

.summary-container.row-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;     
  padding-top: 16px;
}

.summary-gauge {
  width: 110px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
}

.summary-right {
  flex: 1;
  display: flex;
  align-items: center;  
  min-width: 180px;
}
</style>
