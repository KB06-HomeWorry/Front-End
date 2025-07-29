<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <template v-for="agency in agencies" :key="agency.id">
        <KakaoMapCustomOverlay
          :lat="agency.lat"
          :lng="agency.lng"
          :y-anchor="1.1"
        >
          <img
            src="/map_agency_pin.png"
            width="36"
            height="42"
            style="cursor:pointer;"
            @click="onMarkerClick(agency)"
          />
        </KakaoMapCustomOverlay>
      </template>

      <KakaoMapCustomOverlay
        v-if="selectedAgency"
        :lat="selectedAgency.lat"
        :lng="selectedAgency.lng"
        :y-anchor="1.4"
      >
        <div class="custom-overlay">
          <div class="title">{{ selectedAgency.officeName }}</div>
          <div>{{ selectedAgency.agentName }}</div>
          <div>{{ selectedAgency.phone }}</div>
          <div>{{ selectedAgency.address }}</div>
        </div>
      </KakaoMapCustomOverlay>
    </KakaoMap>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay } from 'vue3-kakao-maps'
import axios from 'axios'

const route = useRoute();
const router = useRouter();

const initialCenter = route.query.center?.split(',').map(Number) || [
  37.5435, 127.0812,
];
const lat = ref(initialCenter[0]);
const lng = ref(initialCenter[1]);

const level = ref(Number(route.query.zoomLevel) || 8)
const selectedAgency = ref(null)

// api에서 불러온 중개사 배열
const agencies = ref([])

async function fetchAgencies() {
  try {
  const res = await axios.get('http://localhost:8080/api/agent/geo/list')
  agencies.value = res.data
  } catch (e) {
    alert("중개사무소 위치 정보를 불러오지 못했습니다.")
  }
}

// 마커 클릭 오버레이
async function onMarkerClick(agency) {
  try {
    const sel_agency = await axios.get(`http://localhost:8080/api/agent/${agency.officeId}`)
    selectedAgency.value = {
      ...sel_agency.data,
      lat: agency.lat,
      lng: agency.lng
    }
    console.log(selectedAgency)
  } catch (e) {
    alert("중개사무소 정보를 불러오지 못했습니다.")
  }
}

// 지도 이벤트 기반 쿼리 동기화
function onMapReady(map) {
  kakao.maps.event.addListener(map, 'dragend', () => updateURL(map))
  kakao.maps.event.addListener(map, 'zoom_changed', () => updateURL(map))
}

function updateURL(map) {
  const center = map.getCenter()
  const zoom = map.getLevel()
  router.replace({
    query: {
      ...route.query,
      center: `${center.getLat()},${center.getLng()}`,
      zoomLevel: zoom,
    }
  })
  lat.value = center.getLat()
  lng.value = center.getLng()
  level.value = zoom
}

// SDK 준비 후 실행
function waitKakaoReady() {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      resolve()
    } else {
      const interval = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    }
  })
}

onMounted(async () => {
  // await waitKakaoReady()
  await fetchAgencies()
})

watch(agencies, (newVal) => {
  console.log('agencies changed:', newVal)
})

console.log("--- 중개사무소 정보 ---")
console.log(agencies.value)
</script>

<style>
.custom-overlay {
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  font-size: 14px;
}

.title {
  font-weight: bold;
  margin-bottom: 4px;
}
</style>
