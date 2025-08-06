<template>
  <div style="width: 100%; height: 100vh; position: relative;">
    <!-- 필터 영역 (지도 위) -->
    <div style="position: absolute; left: 0; right: 0; z-index:100;">
      <FilterBar
        :minPyeong="minPyeong"
        :maxPyeong="maxPyeong"
        :selectedTransactionType="selectedTransactionType"
        :sheet-open="isBottomSheetOpen"
        @update:transactionType="val => selectedTransactionType = val"
        @update:minPyeong="val => minPyeong = val"
        @update:maxPyeong="val => maxPyeong = val"
        @update:sheet-open="val => isBottomSheetOpen = val"
        @search="onSearchLocation"
      />
      <ListingToggle :visible="isListingsVisible" @toggle="toggleListings" />
    </div>

    <!-- 카카오맵 -->
    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <!-- Dong 단위 시세(마커) -->
      <template v-if="level >= 5" v-for="(dongMarker, index) in dongMarkers" :key="index">
        <KakaoMapCustomOverlay
          :lat="dongMarker.lat"
          :lng="dongMarker.lng"
          :y-anchor="1.4"
        >
          <MarketPrice :location="dongMarker.dongName" :price="dongMarker.price" />
        </KakaoMapCustomOverlay>
      </template>

      <!-- PriceOnlyBox 단위 마커 -->
      <template v-if="level < 5" v-for="(marker, index) in markers" :key="'marker-'+index">
        <KakaoMapCustomOverlay
          :lat="marker.lat"
          :lng="marker.lng"
          :y-anchor="1.4"
        >
          <MarketPriceDetail
            :price="marker.price"
            :housingType="marker.housingType"
          />
        </KakaoMapCustomOverlay>
      </template>

      <!-- 상세 매물 마커 -->
      <template v-if="level < 5 && isListingsVisible" v-for="(marker, index) in listingMarkers" :key="'listing-' + index">
        <KakaoMapCustomOverlay
          :lat="marker.lat"
          :lng="marker.lng"
          :y-anchor="1.4"
          @click="goDetail(marker.id)"
        >
        <ListingMarkers :marker="marker"/>
        </KakaoMapCustomOverlay>
      </template>
    </KakaoMap>

    <!-- 플로팅 버튼 스택 (우하단에 세로로 묶어서 배치) -->
    <FloatingButtonStack
      v-if="!isBottomSheetOpen"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @move-current-location="moveToCurrentLocation"
    />

    <!-- 현재 동 시세 상단 고정 -->
    <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index:101;">
      <MarketPrice
        v-if="currentDong && currentDongPrice && currentDongPrice !== '0'"
        :location="currentDong"
        :price="currentDongPrice"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapCustomOverlay } from 'vue3-kakao-maps';
import FilterBar from '@/pages/map/components/FilterBar.vue';
import ListingToggle from '@/pages/map/components/ListingToggle.vue';
import MarketPrice from '@/pages/map/components/MarketPrice.vue';
import MarketPriceDetail from '@/pages/map/components/MarketPriceDetail.vue';
import FloatingButtonStack from '@/pages/map/components/FloatingButtonStack.vue';
import ListingMarkers from '@/pages/map/components/ListingMarkers.vue';

const route = useRoute();
const router = useRouter();

const minPyeong = ref(null);
const maxPyeong = ref(null);

const selectedTransactionType = ref([]);
const selectedHousingTypes = ref([]);
const selectedListingTypes = ref([]);

const markers = ref([]);
const dongMarkers = ref([]);
const listingMarkers = ref([]);
const isListingsVisible = ref(true);

// 시트 오픈 상태, 플로팅 버튼 제어용
const isBottomSheetOpen = ref(false);

const lat = ref(route.query.center?.split(',').map(Number)[0] || 37.5435);
const lng = ref(route.query.center?.split(',').map(Number)[1] || 127.0812);
const level = ref(Number(route.query.zoomLevel) || 6);
const mapInstance = ref(null);
const currentLocation = ref(null);
const currentDong = ref('');
const mapCenter = ref({ lat: lat.value, lng: lng.value });

// 카테고리(라우트) → 시세/매물 타입 매핑
const pathToCategory = {
  '/map/apartment': 'apartment',
  '/map/onetwo': 'oneroom',
  '/map/building': 'villa',
  '/map/officetel': 'officetel',
};

const categoryConfig = {
  apartment: {
    priceTypes: ['아파트'],
    listingTypes: [],
  },
  oneroom: {
    priceTypes: [],
    listingTypes: ['원룸'],
  },
  villa: {
    priceTypes: ['연립다세대'],
    listingTypes: ['단독/다가구', '빌라', '상가주택', '다세대'],
  },
  officetel: {
    priceTypes: ['오피스텔'],
    listingTypes: ['오피스텔'],
  },
};

const selectedCategory = ref('apartment');

watch(
  () => route.path,
  (newPath) => {
    selectedCategory.value = pathToCategory[newPath] || 'apartment';
    applyCategoryFilter();
  },
  { immediate: true }
);

function applyCategoryFilter() {
  const conf = categoryConfig[selectedCategory.value] || categoryConfig.apartment;
  selectedHousingTypes.value = [...conf.priceTypes];
  selectedListingTypes.value = [...conf.listingTypes];
  loadPricelist();
  loadListings();
}

watch(selectedHousingTypes, loadPricelist);
watch(selectedListingTypes, loadListings);
watch(selectedTransactionType, loadListings);
watch([minPyeong, maxPyeong], loadListings);

async function loadPricelist() {
  try {
    const response = await fetch('/api/pricetrend');
    const data = await response.json();
    const loadedMarkers = data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.price || item.monthlyRent || '가격없음',
      id: item.id,
      housingType: item.housingType,
    }));
    if (selectedHousingTypes.value.length === 0) {
      markers.value = [];
    } else {
      markers.value = loadedMarkers.filter((marker) =>
        selectedHousingTypes.value.includes(marker.housingType)
      );
    }
  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}
async function loadListings() {
  try {
    const response = await fetch('/api/listing');
    const data = await response.json();
    const loaded = data.map((item) => ({
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
              parseFloat(item.areaInfo.split('/')[1].replace('m', '')) / 3.305785
            )
          : null,
      floorInfo: item.floorInfo,
      direction: item.direction,
      transactionType: item.transactionType,
    }));
    listingMarkers.value = loaded.filter((marker) =>
      (selectedListingTypes.value.length > 0 &&
      selectedListingTypes.value.includes(marker.housingType)) &&
      (marker.areaInfo2 !== null) &&
      (minPyeong.value === null || marker.areaInfo2 >= minPyeong.value) &&
      (maxPyeong.value === null || marker.areaInfo2 <= maxPyeong.value) &&
      (
        !selectedTransactionType.value.length || 
        selectedTransactionType.value.includes(marker.transactionType)
      )
    );
  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}

async function loadMaximumList() {
  try {
    const response = await fetch('/maximums.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const priceIndex = headers.indexOf('THING_AMT_KOR');
    const latIndex = headers.indexOf('latitude');
    const lonIndex = headers.indexOf('longitude');
    const dongName = headers.indexOf('STDG_NM');
    const loadedMarkers = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line) {
        const values = line.split(',');
        const latitude = parseFloat(values[latIndex]);
        const longitude = parseFloat(values[lonIndex]);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          loadedMarkers.push({
            lat: latitude,
            lng: longitude,
            price: values[priceIndex],
            dongName: values[dongName],
          });
        }
      }
    }
    dongMarkers.value = loadedMarkers;
  } catch (error) {
    console.error('Error loading or parsing pricelist.csv:', error);
  }
}

async function loadAllData() {
  await loadPricelist();
  await loadMaximumList();
  await loadListings();
}

onMounted(() => {
  getCurrentLocation(
    (location) => {
      lat.value = location.lat;
      lng.value = location.lng;
      currentLocation.value = location;
      mapCenter.value = location;
      loadAllData();
    },
    () => {
      loadAllData();
    }
  );
});

const getCurrentLocation = (success, fail) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => success({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      fail
    );
  } else {
    fail();
  }
};

const moveToCurrentLocation = () => {
  if (currentLocation.value && mapInstance.value) {
    const newCenter = new window.kakao.maps.LatLng(
      currentLocation.value.lat,
      currentLocation.value.lng
    );
    mapInstance.value.panTo(newCenter);
    mapInstance.value.setLevel(3);
    updateURL(mapInstance.value);
  }
};

const onMapReady = (map) => {
  mapInstance.value = map;
  coor2address({ lat: lat.value, lng: lng.value });
  kakao.maps.event.addListener(map, 'dragend', () => updateURL(map));
  kakao.maps.event.addListener(map, 'zoom_changed', () => updateURL(map));
};

const updateURL = (mapInstance) => {
  const center = mapInstance.getCenter();
  const zoom = mapInstance.getLevel();
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
  coor2address(mapCenter.value);
};
const coor2address = (coordinate) => {
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.coord2Address(coordinate.lng, coordinate.lat, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const dong = result[0]?.address?.region_3depth_name;
      if (dong) {
        currentDong.value = dong;
      }
    }
  });
};

function toggleListings() {
  isListingsVisible.value = !isListingsVisible.value;
}

const currentDongPrice = computed(() => {
  const found = dongMarkers.value.find(m => m.dongName === currentDong.value);
  return found ? found.price : '0';
});

function zoomIn() {
  if (mapInstance.value) {
    mapInstance.value.setLevel(mapInstance.value.getLevel() - 1);
  }
}
function zoomOut() {
  if (mapInstance.value) {
    mapInstance.value.setLevel(mapInstance.value.getLevel() + 1);
  }
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

</script>

<style scoped>
</style>
