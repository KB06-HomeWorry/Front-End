<template>
  <div class="circular-gauge" :style="{ width: size + 'px', height: size + 'px' }">
    <div class="gauge-svg-wrap">
      <svg :width="size" :height="svgSize" :viewBox="`0 0 ${size} ${svgSize}`">
        <circle
          class="bg"
          :cx="center"
          :cy="centerSvg"
          :r="radius"
          fill="none"
          :stroke-width="stroke"
        />
        <circle
          class="progress"
          :cx="center"
          :cy="centerSvg"
          :r="radius"
          fill="none"
          :stroke-width="stroke"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="animatedGaugeOffset"
          :style="{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)' }"
        />
      </svg>
      <div class="score-text">
        <span class="main-score bodyMedium14px">{{ displayScore }}</span>
        <span class="sub-score bodyLight12px">/ 5</span>
      </div>
    </div>
    <div class="gauge-caption bodyMedium10px">전체 지수</div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  score: { type: Number, required: true },
  size: { type: Number, default: 80 },
  stroke: { type: Number, default: 7 },
  color: { type: String, default: '#111f5c' }
});

const svgRatio = 0.83; // SVG 높이 비율 (원+숫자) / 전체 height (예: 0.83이면 80px * 0.83 = 66px)
const svgSize = computed(() => Math.round(props.size * svgRatio));
const center = computed(() => props.size / 2);
const centerSvg = computed(() => svgSize.value / 2);
const radius = computed(() => (svgSize.value - props.stroke) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const percent = computed(() => Math.max(0, Math.min(100, (props.score / 5) * 100)));
const gaugeOffset = computed(() => circumference.value * (1 - percent.value / 100));
const animatedGaugeOffset = ref(circumference.value);

function animateGauge() {
  setTimeout(() => {
    animatedGaugeOffset.value = gaugeOffset.value;
  }, 80);
}
onMounted(() => {
  animatedGaugeOffset.value = circumference.value;
  animateGauge();
});
watch(
  () => props.score,
  () => {
    animatedGaugeOffset.value = circumference.value;
    animateGauge();
  }
);
const displayScore = computed(() => props.score.toFixed(1));
</script>

<style scoped>
.circular-gauge {
  position: relative;
  width: 100px;
  height: 100px; /* size와 맞춤 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.gauge-svg-wrap {
  position: relative;
  width: 100%;
  height: 83%; /* svgRatio와 맞춤 */
  display: grid;
  place-items: center;
}
svg,
.score-text {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  justify-self: center;
  align-self: center;
}
svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  display: block;
}
.score-text {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  flex-direction: row;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}
.gauge-caption {
  width: 100%;
  text-align: center;
  color: var(--color-primary);
  letter-spacing: -0.03em;
  margin-top: 0px;
  line-height: 1.1;
  padding-top: 6px;
}
.sub-score {
  color: var(--color-mediumgray);
  margin-left: 1px;
}
.bg {
  stroke: var(--color-lightgray2);
  stroke-linecap: round;
}
.progress {
  stroke: v-bind(color);
  stroke-linecap: round;
}
</style>
