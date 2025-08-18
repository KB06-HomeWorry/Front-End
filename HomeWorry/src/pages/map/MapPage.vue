<template>
  <div>
    <SimpleHeader title="시세-매물 지도"/>
  <div style="width: 100%; height: 100vh; position: relative">
    <!-- 상단 FilterBar (면적/거래유형/검색) -->
    <div class="top-controls">
      <FilterBar
        :minPyeong="minPyeong"
        :maxPyeong="maxPyeong"
        :selectedTransactionType="selectedTransactionType"
        :sheet-open="isBottomSheetOpen"
        @update:minPyeong="(val) => (minPyeong = val)"
        @update:maxPyeong="(val) => (maxPyeong = val)"
        @update:transactionType="(val) => (selectedTransactionType = val)"
        @update:sheet-open="(val) => (isBottomSheetOpen = val)"
        @search="onSearchLocation"
      />
    </div>

    <!-- 카테고리 칩 6개 (2줄 텍스트, 정사각형 느낌) -->
    <div class="chip-row bodyMedium10px">
      <button
        v-for="btn in categoryButtons"
        :key="btn.id"
        @click="toggleCategory(btn.id)"
        :class="[
          'chip',
          { active: activeCats.has(btn.id) },
          btn.id.startsWith('price-') ? 'price' : 'list',
        ]"
      >
        {{ btn.label }}
      </button>
    </div>

    <!-- 카카오맵 -->
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <!-- 시세 레이어(아파트/오피스텔/연립다세대) -->
      <template v-if="level < 5">
        <template
          v-for="(marker, index) in visiblePriceMarkers"
          :key="'price-' + index"
        >
          <KakaoMapCustomOverlay
            :lat="marker.lat"
            :lng="marker.lng"
            :y-anchor="1.4"
          >
            <MarketPriceDetail
              :price="marker.price"
              :housingType="marker.housingType"
              :id="marker.id"
            />
          </KakaoMapCustomOverlay>
        </template>
      </template>

      <!-- 매물 레이어(원룸/빌라/오피스텔) → FilterBar의 면적/거래유형 필터가 여기 반영됨 -->
      <template v-if="level < 5 && isListingsVisible">
        <template
          v-for="(marker, index) in visibleListingMarkers"
          :key="'listing-' + index"
        >
          <KakaoMapCustomOverlay
            :lat="marker.lat"
            :lng="marker.lng"
            :y-anchor="1.4"
            @click="goDetail(marker.id)"
          >
            <ListingMarkers :marker="marker" />
          </KakaoMapCustomOverlay>
        </template>
      </template>
    </KakaoMap>

    <!-- 플로팅 버튼 스택 -->
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KakaoMap, KakaoMapCustomOverlay } from 'vue3-kakao-maps'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import FilterBar from '@/pages/map/components/FilterBar.vue'
import MarketPriceDetail from '@/pages/map/components/MarketPriceDetail.vue'
import FloatingButtonStack from '@/pages/map/components/FloatingButtonStack.vue'
import ListingMarkers from '@/pages/map/components/ListingMarkers.vue'

defineOptions({ name: 'MapPage' })  // KeepAlive가 구분할 이름

/** 라우터는 센터/줌 동기화만 */
const route = useRoute();
const router = useRouter();

const lat = ref(route.query.center?.split(',').map(Number)[0] || 37.5435);
const lng = ref(route.query.center?.split(',').map(Number)[1] || 127.0812);
const level = ref(Number(route.query.zoomLevel) || 4);
const mapInstance = ref(null);

const isBottomSheetOpen = ref(false);
const isListingsVisible = ref(true);

const currentLocation = ref(null);
const mapCenter = ref({ lat: lat.value, lng: lng.value });

/** FilterBar 상태 */
const minPyeong = ref(null);
const maxPyeong = ref(null);
const selectedTransactionType = ref([]); // ['전세','월세','매매'] 등

/** 칩 6개 */
const categoryButtons = [
  { id: 'price-apartment', label: '아파트\n시세' },
  { id: 'price-officetel', label: '오피스텔\n시세' },
  { id: 'price-villa', label: '연립-\n다세대\n시세' },
  { id: 'list-oneroom', label: '원룸\n매물' },
  { id: 'list-villa', label: '빌라-\n다가구\n매물' },
  { id: 'list-officetel', label: '오피스텔\n매물' },
];

const activeCats = ref(new Set());

const allPriceMarkers = ref([]);
const allListings = ref([]);
const loaded = ref({ price: false, listing: false });

/** 칩 → 타입 매핑 */
const priceTypeByCat = {
  'price-apartment': ['아파트'],
  'price-officetel': ['오피스텔'],
  'price-villa': ['연립다세대'],
};
const listingTypeByCat = {
  'list-oneroom': ['원룸'],
  'list-villa': ['단독/다가구', '빌라', '상가주택', '다세대'],
  'list-officetel': ['오피스텔'],
};

/** 표시용 computed */
const visiblePriceMarkers = computed(() => {
  if (!loaded.value.price) return [];
  const wanted = Object.entries(priceTypeByCat)
    .filter(([cat]) => activeCats.value.has(cat))
    .flatMap(([, t]) => t);
  if (!wanted.length) return [];
  return allPriceMarkers.value.filter((m) => wanted.includes(m.housingType));
});

const visibleListingMarkers = computed(() => {
  if (!loaded.value.listing) return [];
  const wanted = Object.entries(listingTypeByCat)
    .filter(([cat]) => activeCats.value.has(cat))
    .flatMap(([, t]) => t);
  if (!wanted.length) return [];

  // FilterBar의 면적/거래유형 필터를 반영
  return allListings.value.filter(
    (m) =>
      wanted.includes(m.housingType) &&
      m.areaInfo2 !== null &&
      (minPyeong.value === null || m.areaInfo2 >= minPyeong.value) &&
      (maxPyeong.value === null || m.areaInfo2 <= maxPyeong.value) &&
      (!selectedTransactionType.value.length ||
        selectedTransactionType.value.includes(m.transactionType))
  );
});

function toggleCategory(catId) {
  const next = new Set(activeCats.value);
  next.has(catId) ? next.delete(catId) : next.add(catId);
  activeCats.value = next;

  if (catId.startsWith('price-') && !loaded.value.price) loadPrices();
  if (catId.startsWith('list-') && !loaded.value.listing) loadListings();
}

/** 데이터 로딩 */
async function loadPrices() {
  try {
    const res = await fetch('/api/pricetrend');
    const data = await res.json();
    allPriceMarkers.value = data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.price || item.monthlyRent || '가격없음',
      id: item.id,
      housingType: item.housingType,
    }));
    loaded.value.price = true;
  } catch (e) {
    console.error('❌ 시세 로딩 실패:', e);
  }
}
async function loadListings() {
  try {
    const res = await fetch('/api/listing');
    const data = await res.json();
    allListings.value = data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.monthlyRent
        ? `월세 ${item.deposit}/${item.monthlyRent}`
        : item.transactionType === '전세'
        ? `전세 ${item.deposit}`
        : item.rentalCondition || '가격없음',
      id: item.id,
      housingType: item.housingType,
      areaInfo: item.areaInfo,
      areaInfo2:
        item.areaInfo &&
        typeof item.areaInfo === 'string' &&
        item.areaInfo.includes('/')
          ? Math.floor(
              parseFloat(item.areaInfo.split('/')[1].replace('m', '')) /
                3.305785
            )
          : null,
      floorInfo: item.floorInfo,
      direction: item.direction,
      transactionType: item.transactionType,
    }));
    loaded.value.listing = true;
  } catch (e) {
    console.error('❌ 매물 로딩 실패:', e);
  }
}

/** 초기엔 데이터 안 불러오고 위치만 */
onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.value = pos.coords.latitude;
        lng.value = pos.coords.longitude;
        mapCenter.value = { lat: lat.value, lng: lng.value };
      },
      () => {}
    );
  }
});

/** 지도 이벤트 */
function onMapReady(map) {
  mapInstance.value = map;
  kakao.maps.event.addListener(map, 'dragend', () => updateURL(map));
  kakao.maps.event.addListener(map, 'zoom_changed', () => updateURL(map));
}
function updateURL(map) {
  const center = map.getCenter();
  const zoom = map.getLevel();
  router.replace({
    query: {
      ...route.query,
      center: `${center.getLat()},${center.getLng()}`,
      zoomLevel: zoom,
    },
  });
  lat.value = center.getLat();
  lng.value = center.getLng();
  level.value = zoom;
  mapCenter.value = { lat: lat.value, lng: lng.value };
}

/** FilterBar 검색 → 장소 이동 */
function onSearchLocation(keyword) {
  const q = (keyword || '').trim();
  if (!q) return;
  const places = new window.kakao.maps.services.Places();
  places.keywordSearch(q, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK && result.length) {
      const p = result[0];
      const latNum = parseFloat(p.y);
      const lngNum = parseFloat(p.x);
      if (mapInstance.value) {
        const center = new window.kakao.maps.LatLng(latNum, lngNum);
        mapInstance.value.setCenter(center);
        mapInstance.value.setLevel(4);
        lat.value = latNum;
        lng.value = lngNum;
        mapCenter.value = { lat: latNum, lng: lngNum };
      }
    } else {
      alert('검색 결과가 없습니다.');
    }
  });
}
/** 리스팅 토글로 매물 표시 */
function toggleListings() {
  isListingsVisible.value = !isListingsVisible.value;
}
/** 현위치 반환 */
function moveToCurrentLocation() {
  if (!mapInstance.value || !currentLocation.value) return;
  const center = new window.kakao.maps.LatLng(
    currentLocation.value.lat,
    currentLocation.value.lng
  );
  mapInstance.value.panTo(center);
  mapInstance.value.setLevel(3);
  updateURL(mapInstance.value);
}
function zoomIn() {
  if (mapInstance.value)
    mapInstance.value.setLevel(mapInstance.value.getLevel() - 1);
}
function zoomOut() {
  if (mapInstance.value)
    mapInstance.value.setLevel(mapInstance.value.getLevel() + 1);
}

function goDetail(id) {
  if (!id) return;
  router.push({ name: 'agencyDetail', params: { agencyId: String(id) } });
}
</script>

<style scoped>
.top-controls {
  position: absolute;
  z-index: 101;
}

/* 칩 6개 한 줄 고정 */
.chip-row {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 54px;
  z-index: 100;
  display: grid;
  grid-template-columns: repeat(6, 56px);
  gap: 6px;
  justify-content: center;
  overflow-x: auto;
}

.chip {
  width: 56px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  background: #fff;
  cursor: pointer;
  line-height: 1;
  white-space: pre-line;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  box-sizing: border-box;
  letter-spacing: -0.03em;
}
/* 시세 버튼 비활성화 상태 */
.chip.price:not(.active) {
  border-color: #888fad;
}

/* 공통 활성화 상태 */
.chip.active {
  border-color: var(--color-primary);
}

/* 시세 버튼 활성화 */
.chip.active.price {
  background: #e6e8f0;
  color: var(--color-primary);
}

/* 매물 버튼 활성화 */
.chip.active.list {
  background-color: var(--color-primary);
  color: #fff;
}

.list-toggle-fab {
  position: absolute;
  right: 10px;
  top: 134px;
  z-index: 101;
}
</style>
