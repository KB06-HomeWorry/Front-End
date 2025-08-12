<template>
  <div style="width: 100%; height: 100vh">
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <!-- level 4 부터 줌인 시 커스텀 핀 표시 -->
      <template v-if="level <= 4">
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
              <AgencyMapCard
                :agency="selectedAgency"
                @close="selectedAgency = null"
                @detail="goDetail"
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
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay } from "vue3-kakao-maps";
import AgencyMapCard from "@/pages/agency/components/AgencyMapCard.vue";

const pinSrc = `${import.meta.env.BASE_URL}map_agency_pin.png`;
const route = useRoute();
const router = useRouter();

const MAX_LEVEL = 4;

const initialCenter = route.query.center?.split(",").map(Number) || [37.5435, 127.0812];
const lat = ref(initialCenter[0]);
const lng = ref(initialCenter[1]);
const level = ref(Math.min(Number(route.query.zoomLevel) || 8, MAX_LEVEL)); 

const agency_map = ref(null);
const customOverlay = ref(null);
const agencies = ref([]);
const selectedAgency = ref(null);
const map = ref(null);

onMounted(() => {
  loadAgencies();
});

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
};

function onMapReady(mapRef) {
  map.value = mapRef;

  // 초기 진입 시 최대 줌아웃 제한 적용
  if (mapRef.getLevel() > MAX_LEVEL) {
    mapRef.setLevel(MAX_LEVEL);
    level.value = MAX_LEVEL;
  }

  kakao.maps.event.addListener(mapRef, "dragend", () => updateURL(mapRef));
  kakao.maps.event.addListener(mapRef, "zoom_changed", () => {
    const current = mapRef.getLevel();
    if (current > MAX_LEVEL) {
      // 4보다 더 줌아웃하려 하면 다시 4로 되돌림
      mapRef.setLevel(MAX_LEVEL);
      level.value = MAX_LEVEL;
      return; 
    }
    updateURL(mapRef);
  });
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
    selectedAgency.value = { ...data, officeId: agency.officeId, lat: agency.lat, lng: agency.lng };
    console.log(selectedAgency.value);
  } catch (e) {
    alert("중개사무소 정보를 불러오지 못했습니다.");
  }
}

// 상세보기 액션: 라우터 이동 (route name/param은 프로젝트에 맞게 수정)
function goDetail(officeId) {
  const id =
    officeId ??
    selectedAgency.value?.officeId ??
    selectedAgency.value?.office_id ??
    selectedAgency.value?.id;

  if (!id) {
    console.warn("[goDetail] agency id missing", officeId, selectedAgency.value);
    return;
  }
  router.push({ name: "agencyDetail", params: { agencyId: String(id) } });
}

async function onBookmark(officeId) {
  try {
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
