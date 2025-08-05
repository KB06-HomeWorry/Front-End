<!-- src/pages/map/components/ListingMarkers.vue -->
<template>
  <div
    class="custom-overlay text-white"
    style="background-color: var(--color-primary)"
    @click="handleClick"
  >
    {{ marker.areaInfo2 || '-' }}평
    <span v-if="marker.transactionType">| {{ marker.transactionType }}</span>
    <span v-if="marker.housingType">| {{ marker.housingType }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  marker: { type: Object, required: true }
});
function handleClick() {
  // 원하는 클릭 이벤트를 여기에
  console.log(props.marker);
}
</script>

<style scoped>
.custom-overlay {
  padding: 5px 10px;
  background-color: var(--color-primary);
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: auto;
  color: #fff;
}
</style>
