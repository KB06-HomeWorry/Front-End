<template>
  <div class="bar-chart-container">
    <div class="chart-side"></div>
    <div class="chart-bars">
      <!-- 항목 라벨, 바, 점수 표시 -->
      <div
        v-for="(item, i) in chartItems"
        :key="item.label"
        class="chart-item bodyMedium10px"
      >
        <span class="label">{{ item.label }}</span>
        <div class="bar-wrapper">
          <div class="bar" :style="{ width: animatedWidths[i] + '%' }"></div>
        </div>
        <span class="score bodyLight6px">{{ item.score.toFixed(1) }} / 5</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  metricScores: { type: Object, required: true }
})

// 0~100 점수를 0~5 점수로 변환하여 소수 첫째 자리로 반올림
function toFiveScale(score100) {
  return Math.round((score100 / 100) * 50) / 10
}

// 라벨, 바 너비(퍼센트), 5점 환산 점수로 가공
const chartItems = computed(() => {
  if (!props.metricScores || Object.keys(props.metricScores).length === 0) return []
  return [
    {
      label: '매물 신뢰도',
      width: props.metricScores.listing_accuracy_score,
      score: toFiveScale(props.metricScores.listing_accuracy_score)
    },
    {
      label: '비용 투명성',
      width: props.metricScores.cost_transparency_score,
      score: toFiveScale(props.metricScores.cost_transparency_score)
    },
    {
      label: '책임감',
      width: props.metricScores.accountability_score,
      score: toFiveScale(props.metricScores.accountability_score)
    },
    {
      label: '전문성/태도',
      width: props.metricScores.professionalism_score,
      score: toFiveScale(props.metricScores.professionalism_score)
    }
  ]
})

// 애니메이션
const animatedWidths = ref([0, 0, 0, 0])

function runBarAnimation() {
  if (!chartItems.value.length || chartItems.value.length < 4) {
    animatedWidths.value = [0, 0, 0, 0]
    return
  }
  animatedWidths.value = [0, 0, 0, 0]
  nextTick(() => {
    setTimeout(() => {
      animatedWidths.value = chartItems.value.map(item => item.width)
    }, 60)
  })
}

onMounted(runBarAnimation)

watch(
  () => chartItems.value.map(item => item.width),
  runBarAnimation,
  { immediate: true }
)
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