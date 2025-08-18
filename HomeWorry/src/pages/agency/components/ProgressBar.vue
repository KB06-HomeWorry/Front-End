<template>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" :style="{ width: props.percent + '%' }"></div>

    <!-- percent 위치에 이미지 표시 -->
    <img
      v-if="props.pointerImg"
      class="progress-pointer-img"
      :src="props.pointerImg"
      alt=""
      :style="{ left: `calc(${props.percent}% - 12px)` }"
      draggable="false"
    />

    <span class="progress-label bodyMedium10px">{{ props.label }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  percent: { type: Number, required: true },
  label: { type: String, default: '' },
  pointerImg: { type: String, default: '' }
})
</script>

<style scoped>
.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #f1f3f6;
  border-radius: 5px;
  overflow: visible;
  margin: 12px 0 24px;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 5px;
  transition: width 0.3s;
}

.progress-pointer-img {
  position: absolute;
  top: -18px;
  width: 15px;
  height: 15px;
  object-fit: cover;
  transition: left 0.3s;
  z-index: 2;
  pointer-events: none;
}

.progress-label {
  position: absolute;
  right: 8px;
  bottom: -20px;
  color: var(--color-darkgray);
  letter-spacing: -0.1em;
  z-index: 3;
}
</style>
