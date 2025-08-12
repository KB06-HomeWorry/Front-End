<template>
  <div class="location-info-card">
    <!-- 헤더 -->
    <div class="location-header">
      <div class="location-title">
        <span class="titleBold20px">위치정보</span>
      </div>
    </div>

    <!-- 주소 + 복사 -->
    <div class="location-row">
      <img :src="mapLocationIcon" alt="위치" class="icon-location" />
      <span class="address bodyMedium12px">{{ addressText }}</span>
      <button class="copy-btn" @click="copyLocation">
        <img :src="copyIcon" alt="복사" />
        <span class="copy-label bodyMedium10px">복사</span>
      </button>
    </div>

    <!-- 지도 -->
    <div class="location-map" :style="{ height: mapHeight }">
      <KakaoMap
        v-if="hasCoord"
        :lat="lat"
        :lng="lng"
        :level="3"
        :scrollwheel="false"
        :draggable="false"
        :style="{ width: '100%', height: mapHeight }"
        :disableDoubleClickZoom="true"
        :disableDoubleClick="true"
      >
        <KakaoMapMarker :lat="lat" :lng="lng" />
      </KakaoMap>

      <div v-else class="map-empty bodyLight12px" :style="{ height: mapHeight }">좌표 정보가 없습니다.</div>
    </div>

    <!-- 하단 신고 버튼 -->
    <button
      v-if="props.showReportButton"
      class="report-row bodyMedium12px"
      @click="reportItem"
    >
      <span>매물 신고</span>
      <img src="@/assets/icons/alert.png" alt="신고 버튼" class="alert-img" />
    </button>

    <!-- 📌 신고 모달 -->
    <Modal
      v-model="showReportModal"
      message="신고가 접수되었습니다!"
      confirmText="확인"
      @confirm="handleReportConfirm"
      @cancel="handleReportCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
import Modal from '@/components/modal/CustomModal.vue';
import mapLocationIcon from '@/assets/icons/map_location.png';
import copyIcon from '@/assets/icons/copy.png';

/** 부모에서 좌표/주소 받기 */
const props = defineProps({
  lat: { type: Number, required: false, default: null },
  lng: { type: Number, required: false, default: null },
  address: { type: String, required: false, default: '' },
  showReportButton: { type: Boolean, default: true },
});

const hasCoord = computed(() => props.lat != null && props.lng != null);
const addressText = computed(() =>
  props.address?.trim()
    ? props.address
    : hasCoord.value
    ? '좌표 기반 위치'
    : '주소 정보 없음'
);

const mapHeight = computed(() => props.showReportButton ? '170px' : '300px');

// 📌 모달 상태
const showReportModal = ref(false);

async function copyLocation() {
  const text = props.address?.trim();
  if (!text) {
    alert('주소가 없어 복사할 수 없습니다.');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    alert('📌 주소가 복사되었습니다!');
  } catch (err) {
    alert('❌ 복사 실패: ' + err);
  }
}

function reportItem() {
  // 신고 로직 연결 필요
  showReportModal.value = true; // 모달 열기
}

function handleReportConfirm() {
  console.log('신고 확인 버튼 클릭됨');
}

function handleReportCancel() {
  console.log('모달 닫힘');
}
</script>

<style scoped>
.location-info-card {
  background: #fff;
  max-width: 420px;
  margin: 0 auto;
  box-sizing: border-box;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  overflow: hidden;
  width: 100%;
  height: 170px;
  box-shadow: 0 2px 8px rgba(44, 44, 44, 0.06);
  position: relative;
}

.map-empty {
  width: 100%;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-mediumgray);
  background: #fafbfc;
}

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
  width: 16px;
  height: 16px;
  margin-left: 4px;
}
</style>
