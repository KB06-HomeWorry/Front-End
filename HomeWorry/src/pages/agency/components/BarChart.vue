<template>
  <div class="bar-chart-container">
    <div class="chart-side"></div>
    <div class="chart-bars">
      <div
        v-for="(item, i) in chartItems"
        :key="item.label"
        class="chart-item bodyMedium10px"
      >
        <span class="label">{{ item.label }}</span>
        <div class="bar-wrapper">
          <div
            class="bar"
            :style="{ width: animatedWidths[i] + '%' }"
          ></div>
        </div>
        <span class="score bodyLight6px">{{ item.score.toFixed(1) }} / 5</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const scoreRanges = {
  listing_accuracy_score: { min: -5, max: 3 },
  cost_transparency_score: { min: -5, max: 3 },
  professionalism_score: { min: -7, max: 3 },
  accountability_score: { min: -10, max: 5 },
};

const props = defineProps({
  metricScores: { type: Object, required: true },
});

function toFiveScale(score100) {
  return Math.round((score100 / 100) * 50) / 10; // 0~5점, 소수점 1자리
}

const chartItems = computed(() => {
  if (!props.metricScores || Object.keys(props.metricScores).length === 0) return [];

  const normalize = (metric, score) => {
    const range = scoreRanges[metric];
    if (!range) return 0;
    const normalized = ((score - range.min) / (range.max - range.min)) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  return [
    {
      label: '매물 신뢰도',
      width: normalize('listing_accuracy_score', props.metricScores.listing_accuracy_score),
      score: toFiveScale(normalize('listing_accuracy_score', props.metricScores.listing_accuracy_score))
    },
    {
      label: '비용 투명성',
      width: normalize('cost_transparency_score', props.metricScores.cost_transparency_score),
      score: toFiveScale(normalize('cost_transparency_score', props.metricScores.cost_transparency_score))
    },
    {
      label: '책임감',
      width: normalize('accountability_score', props.metricScores.accountability_score),
      score: toFiveScale(normalize('accountability_score', props.metricScores.accountability_score))
    },
    {
      label: '전문성/태도',
      width: normalize('professionalism_score', props.metricScores.professionalism_score),
      score: toFiveScale(normalize('professionalism_score', props.metricScores.professionalism_score))
    },
  ];
});

// 애니메이션 0에서 목표 width로
const animatedWidths = ref([0, 0, 0, 0]);

function runBarAnimation() {
  if (!chartItems.value.length || chartItems.value.length < 4) {
    animatedWidths.value = [0, 0, 0, 0];
    return;
  }
  animatedWidths.value = [0, 0, 0, 0];
  nextTick(() => {
    setTimeout(() => {
      animatedWidths.value = chartItems.value.map(item => item.width);
    }, 60);
  });
}

onMounted(runBarAnimation);

watch(
  () => chartItems.value.map(item => item.width), 
  runBarAnimation,
  { immediate: true }
);
</script>

<style scoped>
.bar-chart-container {
  display: flex;
  width: 100%;
  gap: 0;
  align-items: flex-start;
}

.chart-bars {
  flex-basis: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-item {
  display: flex;
  align-items: center;
}

.label {
  width: 60px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-right: 1px;
}

.bar-wrapper {
  flex-grow: 1;
  height: 9px;
  background-color: var(--color-lightgray2);
  border-radius: 6px;
  overflow: hidden;
  margin: 0 8px 0 0;
}

.bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(.4,0,.2,1);
  background-color: var(--color-primary);
}

.score {
  text-align: right;
  color: var(--color-primary);
  letter-spacing: -0.05em;
}
</style>
