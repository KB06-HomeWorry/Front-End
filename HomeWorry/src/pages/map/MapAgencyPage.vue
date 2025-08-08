<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      :markerCluster="{
        customOverlayProps: agencies,
        calculator: [10, 30, 50],
        minLevel: 4,
        styles: [
          {
            width: '30px',
            height: '30px',
            background: 'rgba(80, 240, 195, 0.8)',
            borderRadius: '15px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '31px'
          },
          {
            width: '40px',
            height: '40px',
            background: 'rgba(0, 173, 255, 0.35)',
            borderRadius: '20px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '41px'
          },
          {
            width: '50px',
            height: '50px',
            background: 'rgba(19, 182, 68, 0.71)',
            borderRadius: '25px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '51px'
          },
          {
            width: '60px',
            height: '60px',
            background: 'rgba(236, 163, 221, 0.58)',
            borderRadius: '30px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '61px'
          }
        ]
      }"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <!-- level 4 부터 줌인 시 커스텀 핀 표시 -->
      <template v-if="level < 4">
        <template v-for="marker in agencies" :key="marker.officeId">
          <KakaoMapMarker
            :lat="marker.lat"
            :lng="marker.lng"
            :clickable="true"
            :image="{
              imageSrc: pinSrc,
              imageWidth: 36,
              imageHeight: 36
            }"
            @onClickKakaoMapMarker="() => onMarkerClick(marker)"
          />

          <!-- 선택된 항목만 커스텀 오버레이(분리한 컴포넌트 사용) -->
          <template v-if="selectedAgency && selectedAgency.officeId === marker.officeId">
            <KakaoMapCustomOverlay
              :lat="marker.lat"
              :lng="marker.lng"
              :z-index="9999"
            >
              <MapAgencyCard
                :agency="selectedAgency"
                @close="selectedAgency = null"
                @detail="goDetail"
                @bookmark="onBookmark"
              />
            </KakaoMapCustomOverlay>
          </template>
        </template>
      </template>
    </KakaoMap>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay} from "vue3-kakao-maps";
import MapAgencyCard from "@/pages/map/components/MapAgencyCard.vue";

const pinSrc = `${import.meta.env.BASE_URL}map_agency_pin.png`;
const route = useRoute();
const router = useRouter();

const initialCenter = route.query.center?.split(",").map(Number) || [37.5435, 127.0812];
const lat = ref(initialCenter[0]);
const lng = ref(initialCenter[1]);
const level = ref(Number(route.query.zoomLevel) || 8);

const agency_map = ref(null);
const customOverlay = ref(null);
const agencies = ref([]);
const selectedAgency = ref(null);
const map = ref(null);
const clusterer = ref();

onMounted(() => {
  loadAgencies();
});

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
};

const onLoadKakaoMapMarkerCluster = (clustererRef) => {
  clusterer.value = clustererRef;
  kakao.maps.event.addListener(clusterer.value, "clusterclick", (cluster) => {
    const currentLevel = map?.value?.getLevel();
    console.log("클러스터 클릭:", cluster, "현재 레벨:", currentLevel);
    if (currentLevel !== undefined && !isNaN(currentLevel)) {
      map.value?.setLevel(currentLevel - 1, { anchor: cluster.getCenter() });
    }
  });
};

// 맵 빈 곳 클릭 시 오버레이 닫기
function onMapReady(mapRef) {
  map.value = mapRef;

  kakao.maps.event.addListener(mapRef, "click", () => {
    selectedAgency.value = null;
  });

  kakao.maps.event.addListener(mapRef, "dragend", () => updateURL(mapRef));
  kakao.maps.event.addListener(mapRef, "zoom_changed", () => updateURL(mapRef));
}

async function loadAgencies() {
  try {
    const response = await fetch("http://localhost:8080/api/agent/geo/list");
    const data = await response.json();
    console.log("API 데이터:", data);
    agencies.value = data.map((item) => ({
      officeId: item.officeId,
      gu: item.gu,
      dong: item.dong,
      id: item.id,
      lat: item.lat,
      lng: item.lng
    }));
  } catch (error) {
    console.error("❌ API 로딩 실패:", error);
  }
}

async function onMarkerClick(agency) {
  try {
    const response = await fetch(`http://localhost:8080/api/agent/${agency.officeId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    // 선택한 마커 좌표를 같이 보관
    selectedAgency.value = { ...data, lat: agency.lat, lng: agency.lng };
        console.log(selectedAgency.value);
  } catch (e) {
    alert("중개사무소 정보를 불러오지 못했습니다.");
  }
}

// 2) 상세보기 액션: 라우터 이동 (route name/param은 프로젝트에 맞게 수정)
function goDetail(officeId) {
  router.push({ name: "agencyDetail", params: { agencyId: officeId } });
}

// 2) 북마크 액션: 실제 API 연동/상태 반영은 프로젝트 로직에 맞게 교체
async function onBookmark(officeId) {
  try {
    // 예시: await fetch('/api/bookmark', { method:'POST', body: JSON.stringify({ officeId }) })
    console.log("bookmark:", officeId);
    alert("북마크에 추가했습니다.");
  } catch {
    alert("북마크 추가에 실패했습니다.");
  }
}

function updateURL(mapRef) {
  const center = mapRef.getCenter();
  const zoom = mapRef.getLevel();
  router.replace({
    query: {
      ...route.query,
      center: `${center.getLat()},${center.getLng()}`,
      zoomLevel: zoom
    }
  });
  lat.value = center.getLat();
  lng.value = center.getLng();
  level.value = zoom;
}
</script>

<style scoped>
/* 오버레이 자체 스타일은 분리한 컴포넌트(AgencyOverlayCard.vue) 내부에 있음 */
</style>
