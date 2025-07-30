<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
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
const agency_map = ref(null)
const customOverlay = ref(null)

// api에서 불러온 중개사 배열
const agencies = ref([])

async function fetchAgencies() {
  try {
  const res = await axios.get('http://localhost:8080/api/agent/geo/list')
  agencies.value = res.data

  return new Promise((resolve) => {
    if (agencies.value.length > 0 && agency_map.value != null) {
      makeMarker()
      resolve()
    } else {
      const interval = setInterval(() => {
        if (agencies.value.length > 0 && agency_map.value != null) {
          clearInterval(interval)
          makeMarker()
          resolve()
        }
      }, 100)
    }
  })
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

// 마커 생성
function makeMarker(){
  const imageSrc = "/map_agency_pin.png"
  const imageSize = new kakao.maps.Size(36, 42)
  const imageOption = { offset: new kakao.maps.Point(18, 36) }

  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  customOverlay.value = new kakao.maps.CustomOverlay({
    map: null,
    position: null,
    content: null,
    xAnchor: 0.5,
    yAnchor: 1.1,
  })

  agencies.value.forEach(agency => {
    const marker = new kakao.maps.Marker({
      map: agency_map.value,
      position: new kakao.maps.LatLng(agency.lat, agency.lng),
      image: markerImage
    })

    kakao.maps.event.addListener(marker, 'click', () => {
      updateCustomOverlay(agency, marker.getPosition())
    })
  })
}

async function updateCustomOverlay (data, position) {
  try {
    const sel_agency = await axios.get(`http://localhost:8080/api/agent/${data.officeId}`)
    
    const content = `
    <div class="custom-overlay">
      <div class="close-btn" title="닫기">X</div>
      <div class="title">${sel_agency.data.officeName}</div>
      <div>${sel_agency.data.agentName}</div>
      <div>${sel_agency.data.address}</div>
      <div>${sel_agency.data.phone}</div>
    </div>`

    customOverlay.value.setContent(content);
    customOverlay.value.setPosition(position);
    customOverlay.value.setMap(agency_map.value);

    document.querySelector('.custom-overlay .close-btn').onclick = () => {
    closeCustomOverlay();
  };
  } catch (e) {
    alert("중개사무소 정보를 불러오지 못했습니다.")
  }
}

const closeCustomOverlay = () => {
  customOverlay.value.setMap(null);
};

// 지도 이벤트 기반 쿼리 동기화
function onMapReady(map) {
  kakao.maps.event.addListener(map, 'dragend', () => updateURL(map))
  kakao.maps.event.addListener(map, 'zoom_changed', () => updateURL(map))
  agency_map.value = map
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
      fetchAgencies()
      resolve()
    } else {
      const interval = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          clearInterval(interval)
          fetchAgencies()
          resolve()
        }
      }, 100)
    }
  })
}

onMounted(async () => {
  await waitKakaoReady()
})

watch(agencies, (newVal) => {
  console.log('agencies changed:', newVal)
})
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
