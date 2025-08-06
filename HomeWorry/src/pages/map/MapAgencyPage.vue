<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      :markerCluster="{
        customOverlayProps: agencies,
        calculator: [10, 30, 50],

        texts: ['군자역', '세종대', '김원관', '세종대왕릉'],

        styles: [
          {
            width: '30px',

            height: '30px',

            background: 'rgba(80, 240, 195, 0.8)',

            borderRadius: '15px',

            color: '#000',

            textAlign: 'center',

            fontWeight: 'bold',

            lineHeight: '31px',
          },

          {
            width: '40px',

            height: '40px',

            background: 'rgba(0, 173, 255, 0.35)',

            borderRadius: '20px',

            color: '#000',

            textAlign: 'center',

            fontWeight: 'bold',

            lineHeight: '41px',
          },

          {
            width: '50px',

            height: '50px',

            background: 'rgba(19, 182, 68, 0.71)',

            borderRadius: '25px',

            color: '#000',

            textAlign: 'center',

            fontWeight: 'bold',

            lineHeight: '51px',
          },

          {
            width: '60px',

            height: '60px',

            background: 'rgba(236, 163, 221, 0.58)',

            borderRadius: '30px',

            color: '#000',

            textAlign: 'center',

            fontWeight: 'bold',

            lineHeight: '61px',
          },
        ],
      }"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <template v-if="level < 3">
        <template v-for="(marker, index) in agencies" :key="marker.officeId">
          <KakaoMapMarker
            :lat="marker.lat"
            :lng="marker.lng"
            :clickable="true"
            :image="{
              imageSrc: '/map_agency_pin.png',
              imageWidth: 43,
              imageHeight: 43,
              imageOption: {},
            }"
            @onClickKakaoMapMarker="() => onMarkerClick(marker)"
          />
          <template v-if="selectedAgency && selectedAgency.officeId === marker.officeId">
            <KakaoMapCustomOverlay :lat="marker.lat" :lng="marker.lng">
              <div
                style="
                  padding: 10px;
                  background-color: white;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <!-- <div style="font-weight: bold; margin-bottom: 5px">카카오 스페이스닷원</div> -->
                <!-- <div style="font-weight: bold; margin-bottom: 5px">
                  {{ selectedAgency }}
                </div> -->
                <div style="font-weight: bold; margin-bottom: 5px">
                  {{ selectedAgency.officeName }}
                </div>

                <div style="display: flex">
                  <div style="margin-right: 10px">
                    <img
                      src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png"
                      width="73"
                      height="70"
                    />
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-start">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                      {{ selectedAgency.agentName }}
                    </div>
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                      {{ selectedAgency.address }}
                    </div>
                    <div>
                      <a
                        href="https://www.kakaocorp.com/main"
                        target="_blank"
                        style="color: blue"
                        >{{ selectedAgency.phone }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </KakaoMapCustomOverlay>
          </template>
        </template>
      </template>
    </KakaoMap>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay } from 'vue3-kakao-maps'

const route = useRoute()
const router = useRouter()

const initialCenter = route.query.center?.split(',').map(Number) || [37.5435, 127.0812]
const lat = ref(initialCenter[0])
const lng = ref(initialCenter[1])

const level = ref(Number(route.query.zoomLevel) || 8)
const agency_map = ref(null)
const customOverlay = ref(null)

// api에서 불러온 중개사 배열
const agencies = ref([])
const selectedAgency = ref(null)

onMounted(() => {
  loadAgencies()
})

const map = ref()
const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef
}

// KakaoMap 내부의 clusterer 객체를 가져와 이벤트 핸들러를 등록해줍니다.
const clusterer = ref()
const onLoadKakaoMapMarkerCluster = (clustererRef) => {
  clusterer.value = clustererRef

  kakao.maps.event.addListener(clusterer.value, 'clusterclick', function (cluster) {
    const currentLevel = map?.value?.getLevel()
    console.log('클러스터 클릭:', cluster, '현재 레벨:', currentLevel)
    if (currentLevel !== undefined && !isNaN(currentLevel)) {
      const newLevel = currentLevel - 1 //클러스터 클릭시 1레벨 zoom in
      map.value?.setLevel(newLevel, { anchor: cluster.getCenter() })
    }
  })
}

async function loadAgencies() {
  try {
    const response = await fetch('http://localhost:8080/api/agent/geo/list') // ✅ API 호출
    const data = await response.json() // ✅ JSON 파싱

    const loadedagencies = data.map((item) => ({
      officeId: item.officeId,
      gu: item.gu,
      dong: item.dong, // 상황에 따라 적절한 필드 사용
      id: item.id,
      lat: item.lat,
      lng: item.lng,
    }))

    agencies.value = loadedagencies
  } catch (error) {
    console.error('❌ API 로딩 실패:', error)
  }
}

// 마커 클릭 오버레이 (fetch 사용)
async function onMarkerClick(agency) {
  try {
    const response = await fetch(`http://localhost:8080/api/agent/${agency.officeId}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    selectedAgency.value = {
      ...data,
      lat: agency.lat,
      lng: agency.lng,
    }
    console.log(selectedAgency.value)
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
}

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
    },
  })
  lat.value = center.getLat()
  lng.value = center.getLng()
  level.value = zoom
}
</script>

<style>
.custom-overlay {
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  min-width: 200px;
}
.custom-overlay .title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}
.custom-overlay .close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style>
