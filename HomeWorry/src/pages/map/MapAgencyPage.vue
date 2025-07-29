<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <template v-for="agency in agenciesFiltered" :key="agency.id">
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
          <div class="title">{{ selectedAgency.office_name }}</div>
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

const route = useRoute();
const router = useRouter();

const initialCenter = route.query.center?.split(',').map(Number) || [
  37.5435, 127.0812,
];
const lat = ref(initialCenter[0]);
const lng = ref(initialCenter[1]);

const level = ref(Number(route.query.zoomLevel) || 8)
const selectedAgency = ref(null)

// 하드코딩 중개사 데이터 (좌표 없음)
// const agencyData = [
//   { id: 1,  officeName: "광진공인중개사사무소", agentName: "김광진", phone: "02-1111-1001", address: "서울특별시 광진구 자양동 111-1" },
//   { id: 2,  officeName: "행복부동산",           agentName: "이행복", phone: "02-1111-1002", address: "서울 광진구 아차산로25길 13 1층" },
//   { id: 3,  officeName: "희망공인중개사",       agentName: "박희망", phone: "02-1111-1003", address: "서울 광진구 아차산로29길 67 영일빌딩 1층" },
//   { id: 4,  officeName: "중앙부동산",           agentName: "최중앙", phone: "02-1111-1004", address: "서울 광진구 능동로 166 1층" },
//   { id: 5,  officeName: "자양에이스부동산",     agentName: "오자양", phone: "02-1111-1005", address: "서울 광진구 동일로18길 43 1층" },
//   { id: 6,  officeName: "진성부동산",           agentName: "진성민", phone: "02-1111-1006", address: "서울특별시 광진구 중곡동 666-6" },
//   { id: 7,  officeName: "행운공인",             agentName: "김행운", phone: "02-1111-1007", address: "서울특별시 광진구 능동 777-7" },
//   { id: 8,  officeName: "성진공인중개사",       agentName: "성진수", phone: "02-1111-1008", address: "서울특별시 광진구 구의동 888-8" },
//   { id: 9,  officeName: "동서부동산",           agentName: "동서남", phone: "02-1111-1009", address: "서울특별시 광진구 군자동 999-9" },
//   { id: 10, officeName: "광장부동산",           agentName: "장광수", phone: "02-1111-1010", address: "서울특별시 광진구 광장동 101-10" },
//   { id: 11, officeName: "새시대부동산",         agentName: "이시대", phone: "02-1111-1011", address: "서울특별시 광진구 구의동 111-11" },
//   { id: 12, officeName: "청솔공인중개사",       agentName: "정청솔", phone: "02-1111-1012", address: "서울특별시 광진구 중곡동 121-12" },
//   { id: 13, officeName: "가온공인중개사",       agentName: "한가온", phone: "02-1111-1013", address: "서울특별시 광진구 자양동 131-13" },
//   { id: 14, officeName: "꿈드림부동산",         agentName: "이꿈",   phone: "02-1111-1014", address: "서울특별시 광진구 군자동 141-14" },
//   { id: 15, officeName: "광진OK부동산",         agentName: "김진오", phone: "02-1111-1015", address: "서울특별시 광진구 능동 151-15" },
//   { id: 16, officeName: "스마일공인중개사",     agentName: "박스마일", phone: "02-1111-1016", address: "서울특별시 광진구 자양동 161-16" },
//   { id: 17, officeName: "골든공인중개사",       agentName: "최골든", phone: "02-1111-1017", address: "서울특별시 광진구 중곡동 171-17" },
//   { id: 18, officeName: "더좋은부동산",         agentName: "유좋은", phone: "02-1111-1018", address: "서울특별시 광진구 화양동 181-18" },
//   { id: 19, officeName: "이룸공인중개사",       agentName: "이이룸", phone: "02-1111-1019", address: "서울특별시 광진구 구의동 191-19" },
//   { id: 20, officeName: "프라임부동산",         agentName: "프라임", phone: "02-1111-1020", address: "서울특별시 광진구 광장동 201-20" }
// ]

// api에서 불러온 중개사 배열
const agencies = ref([])

// lat/lng 없는 데이터 제거한 computed
const agenciesFiltered = computed(() =>
  agencies.value.filter(a => a.lat && a.lng)
)

async function fetchAgencies() {
    // 백엔드 연동 시 수정 요망
    const res = await fetch('http://localhost:3001/agencies')
  let list = await res.json()
  // lat/lng이 없는 경우 지오코딩
  await geocodeMissingLatLng(list)
}

// lat/lng이 없는 경우만 지오코딩
async function geocodeMissingLatLng(list) {
  const geocoder = new window.kakao.maps.services.Geocoder()
  const jobs = list.map(agency =>
    (!agency.lat || !agency.lng)
      ? new Promise(resolve => {
          geocoder.addressSearch(agency.address, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result[0]) {
              resolve({
                ...agency,
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x)
              })
            } else {
              console.error(`지오코딩 실패: '${agency.office_name}' (주소: ${agency.address})`, status);
              resolve(null); // 실패한 경우는 마커에서 제외
            }
          })
        })
      : Promise.resolve(agency)
  )
  const results = await Promise.all(jobs)
  agencies.value = results.filter(Boolean)
  // 첫번째 좌표로 지도 중심 이동
  if (agencies.value[0]) {
    lat.value = agencies.value[0].lat
    lng.value = agencies.value[0].lng
  }
}

// 마커 클릭 오버레이
function onMarkerClick(agency) {
  selectedAgency.value = agency
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
  await waitKakaoReady()
  await fetchAgencies()
})

watch(agencies, (newVal) => {
  console.log('agencies changed:', newVal)
})

console.log(agencies.value, agenciesFiltered.value)
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
