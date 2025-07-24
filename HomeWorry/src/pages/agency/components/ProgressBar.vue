<template>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" :style="{ width: props.percent + '%' }"></div>
    <img
      v-if="props.pointerImg"
      class="progress-pointer-img"
      :src="props.pointerImg"
      alt=""
      :style="{ left: `calc(${props.percent}% - 12px)` }"
      draggable="false"
    />
    <span class="progress-label">{{ props.label }}</span>
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
  margin-bottom: 24px;
  position: relative;
  margin-top: 12px;
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
  right: 12px;
  bottom: -20px;
  top: auto;
  font-size: 13px;
  color: #666;
  font-weight: 500;
  z-index: 3;
}
</style>
