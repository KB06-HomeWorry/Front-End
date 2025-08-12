<template>
  <div>
    <SimpleHeader title="중개사무소 위치" />
    <div style="width: 100%; height: 100vh; position: relative">
      <div class="search-overlay">
        <SearchBar @search="onSearchLocation" />
      </div>
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

      <!-- 플로팅 버튼 스택 (우하단) -->
      <FloatingButtonStack
        v-if="!isBottomSheetOpen"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @move-current-location="moveToCurrentLocation"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay } from "vue3-kakao-maps";
import SimpleHeader from "@/components/layout/SimpleHeader.vue";
import SearchBar from '@/pages/agency/components/AGencyMapSearchBar.vue';
import AgencyMapCard from "@/pages/agency/components/AgencyMapCard.vue";
import FloatingButtonStack from "../map/components/FloatingButtonStack.vue";

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
const mapInstance = map;              // FloatingButtonStack 핸들러에서 참조
const isBottomSheetOpen = ref(false); // 가드 변수

onMounted(() => {
  loadAgencies();
});

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

function onSearchLocation(keyword) {
  if (!keyword) return;
  const geocoder = new window.kakao.maps.services.Places();
  geocoder.keywordSearch(keyword, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
      const place = result[0];
      const latNum = parseFloat(place.y);
      const lngNum = parseFloat(place.x);
      if (mapInstance.value) {
        const center = new window.kakao.maps.LatLng(latNum, lngNum);
        mapInstance.value.setCenter(center);
        mapInstance.value.setLevel(4);
        lat.value = latNum;
        lng.value = lngNum;
        mapCenter.value = { lat: latNum, lng: lngNum };
        coor2address({ lat: latNum, lng: lngNum });
      }
    } else {
      alert('검색 결과가 없습니다.');
    }
  });
}

/*  FloatingButtonStack 핸들러 */
function zoomIn() {
  if (mapInstance.value) {
    mapInstance.value.setLevel(mapInstance.value.getLevel() - 1);
  }
}

function zoomOut() {
  if (mapInstance.value) {
    const current = mapInstance.value.getLevel();
    const next = current + 1;
    if (next <= MAX_LEVEL) {
      mapInstance.value.setLevel(next);
    }
  }
}

function moveToCurrentLocation() {
  if (!navigator.geolocation || !mapInstance.value) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latNum = pos.coords.latitude;
      const lngNum = pos.coords.longitude;
      const center = new window.kakao.maps.LatLng(latNum, lngNum);
      mapInstance.value.setCenter(center);
      mapInstance.value.setLevel(3);
      lat.value = latNum;
      lng.value = lngNum;
      updateURL(mapInstance.value);
    },
    () => {
      alert("현재 위치를 가져올 수 없습니다.");
    }
  );
}
</script>

<style scoped>
.search-overlay{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;          /* 필요하면 8~12px 정도 여백 */
  z-index: 1000;   /* 지도 위로 */
}
</style>