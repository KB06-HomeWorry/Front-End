<template>
  <div class="location-info-card">
    <!-- 헤더 -->
    <div class="location-header">
      <div class="location-title">
        <span class="titleBold16px">위치정보</span>
      </div>
    </div>

    <!-- 주소 + 복사 -->
    <div class="location-row">
      <img src="@/assets/icons/map_location.png" alt="위치" class="icon-location" />
      <span class="address bodyMedium12px">{{ address }}</span>
      <button class="copy-btn" @click="copyAddress">
        <img src="@/assets/icons/copy.png" alt="복사" />
        <span class="copy-label bodyMedium10px">복사</span>
      </button>
    </div>

    <!-- 지도 영역 (임시 이미지로 대체) -->
    <div class="location-map">
      <img src="@/assets/icons/nav_map_dark.png" alt="지도" class="map-img" />
    </div>

    <!-- 하단 신고 버튼 -->
    <button class="report-row bodyMedium12px" @click="reportItem">
      <span>매물 신고</span>
      <img src="@/assets/icons/alert.png" alt="신고 버튼" class="alert-img" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const address = ref('서울특별시 영등포구 신길동 194-18')

function copyAddress() {
  navigator.clipboard.writeText(address.value)
  alert('주소가 복사되었습니다!')
}

function reportItem() {
  alert('신고하기 기능은 준비 중입니다!')
}
</script>

<style scoped>
.location-info-card {
  background: #fff;
  padding: 24px 20px 18px 20px;
  max-width: 420px;
  margin: 0 auto;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--color-primary);
}

.location-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.icon-location {
  width: 16px; 
  height: 16px;
}

.address {
  color: var(--color-darkgray);
  margin-right: 4px;
  margin-top: 4px;
}

.copy-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 2px;
}
.copy-btn img {
  width: 10px; 
  height: 10px;
  margin-right: 2px;
}
.copy-label {
  color: var(--color-primary);
  line-height: 12px;
  margin-top: 3px;
}

.location-map {
  margin-top: 6px;
  margin-bottom: 18px;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 170px;
  box-shadow: 0 2px 8px rgba(44,44,44,0.06);
  position: relative;
}
.map-img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  display: block;
}

/* 하단 신고영역(버튼) */
.report-row {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-darkgray);
  margin: 10px auto 0 auto;
  letter-spacing: -0.03em;

  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
}
.report-row span {
  margin-top: 6px;
}
.alert-img {
  width: 16px; height: 16px;
  margin-left: 4px;
}
</style>
