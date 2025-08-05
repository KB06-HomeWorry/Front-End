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
      <img src="@/assets/icons/map_location.png" alt="위치" class="icon-location" />
      <span class="address bodyMedium12px">{{ address }}</span>
      <button class="copy-btn" @click="copyLocation">
        <img src="@/assets/icons/copy.png" alt="복사" />
        <span class="copy-label bodyMedium10px">복사</span>
      </button>
    </div>

    <!-- 지도 영역 -->
    <!-- <div class="location-map">
      <KakaoMap
    v-if="lat && lng"
    :lat="lat"
    :lng="lng"
    :level="3"
    style="width: 100%; height: 170px"
  >
    <KakaoMapMarker :lat="lat" :lng="lng" />
  </KakaoMap>
      <img src="@/assets/icons/nav_map_dark.png" alt="지도" class="map-img" />
    </div> -->

    <!-- 하단 신고 버튼 -->
    <!-- <button class="report-row bodyMedium12px" @click="reportItem">
      <span>매물 신고</span>
      <img src="@/assets/icons/alert.png" alt="신고 버튼" class="alert-img" />
    </button> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'

const address = ref('서울특별시 광진구');
const lat = ref(null)
const lng = ref(null)

const currentLocation = ref({ lat: null, lng: null })

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latVal = position.coords.latitude;
      const lngVal = position.coords.longitude;
      currentLocation.value = { lat: latVal, lng: lngVal };
    });
  } else {
    alert('Geolocation을 지원하지 않는 브라우저입니다.');
  }
};

const copyLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation을 지원하지 않는 브라우저입니다.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latVal = position.coords.latitude;
      const lngVal = position.coords.longitude;

      lat.value = latVal
      lng.value = lngVal
      currentLocation.value = { lat: latVal, lng: lngVal };

      const text = `${latVal}, ${lngVal}`;
      try {
        await navigator.clipboard.writeText(text);
        alert('📌 위치 좌표가 복사되었습니다!');
      } catch (err) {
        alert('❌ 복사 실패: ' + err);
      }
    },
    (error) => {
      alert('❌ 위치 정보를 가져올 수 없습니다.');
      console.error(error);
    }
  );
};

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