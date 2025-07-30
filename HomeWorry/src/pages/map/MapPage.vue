<template>
  <div style="width: 100%; height: 100vh">

    <div>
      <FilterBar />
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
          <div class="custom-overlay" @click="goToDetail(marker)">
            <span @click="console.log(marker)"> {{ marker.price }}</span>
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
    <div
      class="custom-overlay text-white"
      style="background-color: #1e3a8a;"
      @click="goToDetail(marker)"
    >
      {{ marker.price }}
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
} from 'vue3-kakao-maps';
import FilterBar from '../map/components/FilterBar.vue'
import ListingToggle from './ListingToggle.vue';

const route = useRoute();
const router = useRouter();

const initialCenter = route.query.center?.split(',').map(Number) || [
  37.5435, 127.0812,
];
const lat = ref(initialCenter[0]);
const lng = ref(initialCenter[1]);
const currentLocation = ref(null);
const level = ref(Number(route.query.zoomLevel) || 8);

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      currentLocation.value = { lat, lng };
      mapCenter.value = { lat, lng };
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

const markers = ref([]);
const dongMarkers = ref([]);
const mapInstance = ref(null);
const currentDong = ref('');
const mapCenter = ref({ lat: lat.value, lng: lng.value });
const randomBgClass = ref('bg-white'); // Initial Tailwind background class

const listingMarkers = ref([]);

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

onMounted(async () => {
  await loadPricelist();
  await loadMaximumList();
  getCurrentLocation();
  await loadListings();
});

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
    const data = await response.json();              // ✅ JSON 파싱

    const loadedMarkers = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.price || item.monthlyRent || '가격없음',  // 상황에 따라 적절한 필드 사용
    }));

    markers.value = loadedMarkers;

  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}

// listing map
async function loadListings() {
  try {
    const response = await fetch('/api/listing');
    const data = await response.json();              

    const loaded = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      price: item.monthlyRent
        ? `월세 ${item.deposit}/${item.monthlyRent}`
        : `전세 ${item.deposit}`,
      id: item.id,
      title: item.listing,
      address: item.address,
      deposit: item.deposit,
      rent: item.monthlyRent,
    }));

    listingMarkers.value = loaded;

  } catch (error) {
    console.error('❌ API 로딩 실패:', error);
  }
}



const onMapReady = (map) => {
  mapInstance.value = map;
  coor2address({ lat: lat.value, lng: lng.value });

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
      price: marker.price
    }
  });
}

// listing toggle
const isListingsVisible = ref(false);

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
