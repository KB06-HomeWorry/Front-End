<template>
  <div class="floating-btn-stack">
    <div class="custom-zoom-control titleBold20px">
      <button @click="$emit('zoom-in')">+</button>
      <button @click="$emit('zoom-out')">-</button>
    </div>
    <button
      class="move-current-location-btn"
      title="현재 위치로 이동"
      @click="$emit('move-current-location')"
    >
      <img :src="location" alt="현재 위치" />
    </button>
  </div>
</template>

<script setup>
// 부모 MapPage.vue(현재 수정중에는 FixMapPage.vue)에서 이벤트 처리
import location from "@/assets/icons/Location.png";
</script>

<style scoped>
.floating-btn-stack {
  position: absolute;
  right: 24px;
  bottom: 150px;
  z-index: 110;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.custom-zoom-control {
  position: static;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.move-current-location-btn {
  position: static;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(34, 101, 246, 0.12);
  z-index: 102;
}

.move-current-location-btn img {
  width: 40px;
  height: 40px;
}

.custom-zoom-control button {
  width: 40px;
  height: 40px;
  background: var(--color-white);
  border-radius: 12px;
  padding-top: 4px;
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(34, 101, 246, 0.12);
  cursor: pointer;
}
</style>
