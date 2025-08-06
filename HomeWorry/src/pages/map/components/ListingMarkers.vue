<template>
  <div
    class="custom-overlay"
    @click="handleClick"
  >
    <div class="type bodyMedium8px">{{ marker.housingType || '-' }}</div>
    <div class="info bodyMedium8px">
      <span v-if="marker.transactionType">{{ marker.transactionType }}</span>
      <span v-if="marker.areaInfo2">-{{ marker.areaInfo2 }}평</span>
    </div>
    <img
      src="@/assets/icons/house_pin.png"
      class="star-icon"
      alt="star"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter(); 

const props = defineProps({
  marker: { type: Object, required: true }
});

function handleClick() {
  if (props.marker?.id) {
    router.push(`/listing/${props.marker.id}`);
  } else {
    console.log(props.marker); // id가 없는 데이터 로그
  }
}
</script>

<style scoped>
.custom-overlay {
  padding: 6px 8px;
  background-color: var(--color-primary);
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: auto;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  height: 32px;
  cursor: pointer;
}

.type {
  margin-bottom: 1px;
}

.info {
  opacity: 0.95;
}

/* 별 아이콘 */
.star-icon {
  width: 14px;
  height: 14px;
  margin-top: 6px;
  display: block;
}
</style>
