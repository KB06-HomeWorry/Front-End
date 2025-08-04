<template>
  <div style="width: 100%; height: 100vh">
    <div class="flex gap-4 p-4">
      <button
        @click="moveToCurrentLocation"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Current Location
      </button>
      <div :class="randomBgClass" class="bg-opacity-30 p-2 rounded">
        <label
          v-for="type in ['아파트', '연립다세대', '오피스텔']"
          :key="type"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="type" v-model="selectedHousingTypes" />
          {{ type }}
        </label>
      </div>
    </div>
    <!-- Listing types checkboxes -->
    <div class="flex gap-4 p-4">
      <div :class="randomBgClass" class="bg-opacity-30 p-2 rounded">
        <label
          v-for="type in [
            '원룸',
            '오피스텔',
            '빌라',
            '단독/다가구',
            '상가주택',
            '다세대',
            '최근',
          ]"
          :key="type"
          class="flex items-center gap-1"
        >
          <input type="checkbox" :value="type" v-model="selectedListingTypes" />
          {{ type }}
        </label>
        <FilterBar
          :minPyeong="minPyeong"
          :maxPyeong="maxPyeong"
          @updatePyeong="handlePyeongUpdate"
        />

        Current filter display
        <div class="flex items-center gap-2 mt-2 p-2 bg-gray-100 rounded">
          <span class="text-sm font-medium">현재 필터:</span>
          <span class="text-sm">
            평수: {{ minPyeong || '전체' }} ~ {{ maxPyeong || '전체' }}
          </span>
          <span class="text-sm">
            | 거래유형: {{ selectedTransactionType || '전체' }}
          </span>
          <span class="text-sm"> | 매물수: {{ listingMarkers.length }}개 </span>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <label>거래 유형:</label>
          <select
            v-model="selectedTransactionType"
            class="border px-2 py-1 rounded"
          >
            <option value="">전체</option>
            <option value="전세">전세</option>
            <option value="월세">월세</option>
            <option value="단기임대">단기임대</option>
          </select>
        </div>
      </div>
    </div>

    <ListingToggle :visible="isListingsVisible" @toggle="toggleListings" />

    <KakaoMap
      :lat="lat"
      :lng="lng"
      :level="level"
      @onLoadKakaoMap="onMapReady"
      style="width: 100%; height: 100%"
    >
      <!-- Price Markers with Custom Overlays -->
      <!--  :markerCluster="{ customOverlayProps: markers }"  -->
      <template
        v-if="level >= 4"
        v-for="(dongMarker, index) in dongMarkers"
        :key="index"
      >
        <KakaoMapCustomOverlay
          :lat="dongMarker.lat"
          :lng="dongMarker.lng"
          :y-anchor="1.4"
        >
          <div class="custom-overlay">
            <!-- {{ (dongMarker.dongName, dongMarker.price) }} -->
            <span class="bg-red-500 text-white px-2 py-1 rounded">
              {{ dongMarker.dongName }})
            </span>
            {{ dongMarker.price }}
            <!-- {{ dongMarker }} -->
          </div>
        </KakaoMapCustomOverlay>
      </template>

      <template
        v-if="level < 4"
        v-for="(marker, index) in markers"
        :key="index"
      >
        <KakaoMapCustomOverlay
          :lat="marker.lat"
          :lng="marker.lng"
          :y-anchor="1.4"
        >
          <!-- click 추가 -->
          <!-- <div class="custom-overlay" @click="goToDetail(marker)"> -->
          <div class="custom-overlay">
            <span @click="console.log(marker)"> {{ marker }}</span>
            <!-- <span> {{ marker.price }}</span> -->
          </div>
        </KakaoMapCustomOverlay>
      </template>
      <!-- listingMarkers 지도에 표시 -->
      <template
        v-if="level < 4 && isListingsVisible"
        v-for="(marker, index) in listingMarkers"
        :key="'listing-' + index"
      >
        <KakaoMapCustomOverlay
          :lat="marker.lat"
          :lng="marker.lng"
          :y-anchor="1.4"
        >
          <!-- <div
            class="custom-overlay text-white"
            style="background-color: #1e3a8a"
            @click="goToDetail(marker)"
            > -->
          <div
            class="custom-overlay text-white"
            style="background-color: #1e3a8a"
            @click="console.log(marker.areaInfo2)"
          >
            {{ marker.areaInfo2 }}
          </div>
        </KakaoMapCustomOverlay>
      </template>
    </KakaoMap>

    <h1 class="dong-label bg-opacity-50" :class="randomBgClass">
      📍 {{ currentDong }} ({{ mapCenter.lat.toFixed(4) }},
      {{ mapCenter.lng.toFixed(4) }})
      {{ level }}
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapCustomOverlay } from 'vue3-kakao-maps';
import FilterBar from './components/FilterBar.vue';

const route = useRoute();
const router = useRouter();

const minPyeong = ref(null);
const maxPyeong = ref(null);

const handlePyeongUpdate = (pyeong) => {
  // Update the area filter values from the FilterBar component
  minPyeong.value = pyeong.min;
  maxPyeong.value = pyeong.max;
  // Manually trigger loadListings() to refresh the data
  loadListings();
  console.log('Area filter updated:', pyeong);
};

const lat = ref(route.query.center?.split(',').map(Number)[0] || 37.5435);
const lng = ref(route.query.center?.split(',').map(Number)[1] || 127.0812);
const currentLocation = ref(null);
const level = ref(Number(route.query.zoomLevel) || 8);

const getCurrentLocation = (successCallback, errorCallback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        successCallback({ lat, lng });
      },
      (error) => {
        console.error('Geolocation error:', error);
        errorCallback();
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    errorCallback();
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

const markers = ref([]);
const dongMarkers = ref([]);
const mapInstance = ref(null);
const currentDong = ref('');
const mapCenter = ref({ lat: lat.value, lng: lng.value });
const randomBgClass = ref('bg-white'); // Initial Tailwind background class

const listingMarkers = ref([]);
const selectedListingTypes = ref([
  '원룸',
  '오피스텔',
  '빌라',
  '단독/다가구',
  '상가주택',
  '다세대',
  '최근',
]);
const selectedHousingTypes = ref(['아파트', '연립다세대', '오피스텔']);
const selectedTransactionType = ref('');

// Tailwind CSS background colors for the label
const tailwindBgColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
];

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
      console.error('Failed to get current location, using default.');
      loadAllData();
    }
  );
});

async function loadAllData() {
  await loadPricelist();
  await loadMaximumList();
  await loadListings();
}

watch(selectedHousingTypes, () => {
  loadPricelist();
});
watch(selectedListingTypes, () => {
  loadListings();
});

watch(selectedTransactionType, () => {
  loadListings();
});

// Watch for area filter changes - removed to prevent infinite loop
// The loadListings() will be called manually when FilterBar emits updatePyeong

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

// Load pricelist data
async function loadPricelist() {
  try {
    const response = await fetch('/api/pricetrend'); // ✅ API 호출
    const data = await response.json(); // ✅ JSON 파싱

    const loadedMarkers = data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.price || item.monthlyRent || '가격없음', // 상황에 따라 적절한 필드 사용
      id: item.id,
      year: item.year,
      districtCode: item.districtCode,
      districtName: item.districtName,
      dongCode: item.dongCode,
      dongName: item.dongName,
      lotTypeCode: item.lotTypeCode,
      lotType: item.lotType,
      mainNo: item.mainNo,
      subNo: item.subNo,
      buildingName: item.buildingName,
      contractDay: item.contractDay,
      archArea: item.archArea,
      landArea: item.landArea,
      floor: item.floor,
      builtYear: item.builtYear,
      housingType: item.housingType,
      dealType: item.dealType,
      address: item.address,
    }));

    markers.value = loadedMarkers.filter((marker) =>
      selectedHousingTypes.value.includes(marker.housingType)
    );
  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}

// listing map
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
      title: item.listing,
      address: item.address,
      deposit: item.deposit,
      rent: item.monthlyRent,
      rentalCondition: item.rentalCondition,
      details: item.details,
      agency: item.agency,
      transactionType: item.transactionType,
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
    }));

    listingMarkers.value = loaded.filter(
      (marker) =>
        selectedListingTypes.value.includes(marker.housingType) &&
        // Area filter: 평수 filtering based on AreaSlider values
        (minPyeong.value === null || marker.areaInfo2 >= minPyeong.value) &&
        (maxPyeong.value === null || marker.areaInfo2 <= maxPyeong.value) &&
        (selectedTransactionType.value === '' ||
          marker.transactionType === selectedTransactionType.value)
    );
  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}

const onMapReady = (map) => {
  mapInstance.value = map;
  coor2address({ lat: lat.value, lng: lng.value });

  // Add map type control (top right)
  const mapTypeControl = new window.kakao.maps.MapTypeControl();
  map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

  // Add zoom control (right)
  const zoomControl = new window.kakao.maps.ZoomControl();
  map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

  kakao.maps.event.addListener(map, 'dragend', () => updateURL(map));
  kakao.maps.event.addListener(map, 'zoom_changed', () => updateURL(map));
};

// Updates the URL with the current map center and zoom level
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

// Gets the administrative district ("dong") from coordinates
const coor2address = (coordinate) => {
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.coord2Address(coordinate.lng, coordinate.lat, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const dong = result[0]?.address?.region_3depth_name;
      if (dong) {
        currentDong.value = dong;
        randomBgClass.value = getRandomTailwindBgClass(); // Update background class
      }
    } else {
      console.error('Geocoder failed with status:', status);
    }
  });
};

// Returns a random Tailwind CSS background class
const getRandomTailwindBgClass = () => {
  const randomIndex = Math.floor(Math.random() * tailwindBgColors.length);
  return tailwindBgColors[randomIndex];
};

//map 다음 상세 페이지 이동
function goToDetail(marker) {
  if (!marker.lat || !marker.lng) {
    console.error('❌ 마커 좌표 없음:', marker);
    return;
  }

  router.push({
    path: '/map/detail',
    query: {
      lat: marker.lat,
      lng: marker.lng,
      price: marker.price,
    },
  });
}

// listing toggle
const isListingsVisible = ref(true);

function toggleListings() {
  isListingsVisible.value = !isListingsVisible.value;

  if (isListingsVisible.value) {
    // 마커 생성 로직 (지도에 매물 표시)
  } else {
    // 마커 제거 로직
  }
}
</script>

<style>
.custom-overlay {
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: auto;
}
.dong-label {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 18px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
