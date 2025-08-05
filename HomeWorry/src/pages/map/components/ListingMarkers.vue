<template>
  <div
    class="custom-overlay"
    @click="handleClick"
  >
    <div class="type bodyMedium10px">{{ marker.housingType || '-' }}</div>
    <div class="info bodyMedium10px">
      <span v-if="marker.transactionType">{{ marker.transactionType }}</span>
      <span v-if="marker.areaInfo2">-{{ marker.areaInfo2 }}평</span>
    </div>
    <img
      src="@/assets/icons/star_filled.png"
      class="star-icon"
      alt="star"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  marker: { type: Object, required: true }
});
function handleClick() {
  console.log(props.marker);
}
</script>

<style scoped>
.custom-overlay {
  padding: 6px 12px;
  background-color: var(--color-primary);
  border-radius: 12px;
  white-space: nowrap;
  pointer-events: auto;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  height: 35px;
}

.type {
  margin-bottom: 1px;
}

.info {
  opacity: 0.95;
}

/* 별 아이콘 */
.star-icon {
  width: 12px;
  height: 12px;
  margin-top: 2px;
  display: block;
}
</style>
