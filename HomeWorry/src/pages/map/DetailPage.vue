<template>
  <div>
    <button @click="goBackToMap"><</button>
    <img :src="roomImg" alt="매물 이미지" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; margin-bottom: 10px;"/>
    <section>
        <div><span>{{ buildingName }}</span></div>
        <div><h2 style="font-size: 24px; font-weight: bold;">{{ price }}</h2></div>
      </section>
    <!-- <section>
        <h2>실거래가</h2>
        <h3>계약일 층 거래 정보</h3>
    </section> -->

    <div class="section-bar">
      <button @click="scrollTo('deal')" :class="['section-btn', { active: activeSection === 'deal' }]">거래정보</button>
      <button @click="scrollTo('listing')" :class="['section-btn', { active: activeSection === 'listing' }]">매물정보</button>
      <button @click="scrollTo('location')" :class="['section-btn', { active: activeSection === 'location' }]">위치정보</button>
    </div>
    <section ref="deal">
      <h3 style="font-size: 20px; font-weight: bold;">거래 정보</h3>
      <h3>거래방식 {{ price }}</h3>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 16px 0;" />
    </section>
    <section ref="listing">
      <h3 style="font-size: 20px; font-weight: bold;">매물 정보</h3>
      <h2>건물형태 {{housingType}}</h2>
      <h2>전용/계약면적 {{ areaInfo }}</h2>
      <h2>해당층/전체층 {{ floorInfo }}</h2>
      <h2>방향 {{ direction }}</h2>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 16px 0;" />
    </section>
    <section ref="location">
      <h3 style="font-size: 20px; font-weight: bold;">위치 정보</h3>
      <button @click="copyLocation">위치</button>
    </section>
    <KakaoMap
  v-if="lat && lng"
  :lat="lat"
  :lng="lng"
  :level="3"
  style="width: 100%; height: 300px"
>
 <KakaoMapMarker :lat="lat" :lng="lng" />
</KakaoMap>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
import { ref, onMounted } from 'vue';
import roomImg from '@/assets/icons/room.png';

const router = useRouter();
const route = useRoute();

const lat = ref(null);
const lng = ref(null);
const price = ref('');
const buildingName = ref('');
const deposit = ref('');
const rent = ref('');
const housingType=ref('');
const floorInfo=ref('');
const areaInfo=ref('');
const direction=ref('');

const activeSection = ref('deal');

const currentLocation = ref({lat:null,lng:null});


function goBackToMap() {
  router.push('/map');
}

onMounted(async () => {
  const id = route.query.id;
  const source=route.query.source || 'listing';
  if (!id) {
    console.error('❌ id 없음');
    return;
  }

  try {
    const endpoint =
      source === 'pricetrend'
      ?`/api/pricetrend/${id}`
      :`/api/listing/${id}`;


   const response = await fetch(endpoint);
    const data = await response.json();

    lat.value = data.latitude;
    lng.value = data.longitude;

    if (source === 'listing') {
      price.value = data.monthlyRent
        ? `월세 ${data.deposit}/${data.monthlyRent}`
        : `전세 ${data.deposit}`;
      buildingName.value = data.listing;
      deposit.value = data.deposit;
      rent.value = data.monthlyRent;
      housingType.value = data.housingType;
      floorInfo.value = data.floorInfo;
      areaInfo.value = data.areaInfo;
      direction.value = data.direction;
    } else if (source === 'pricetrend') {
      price.value = data.price;
      buildingName.value = data.buildingName || '실거래가'; // 예시
      housingType.value = data.housingType || '';
      // 기타 필요 정보 추가
    }

  } catch (error) {
    console.error('❌ 상세정보 로딩 실패:', error);
  }
});

//
const deal = ref(null)
const listing = ref(null)
const location = ref(null)

function scrollTo(section) {
  activeSection.value = section;

  const targetRef = {
    deal,
    listing,
    location,
  }[section];

  targetRef?.value?.scrollIntoView({ behavior: 'smooth' });
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latVal = position.coords.latitude;
      const lngVal = position.coords.longitude;
      currentLocation.value = { lat: latVal, lng: lngVal };
    });
  } else {
    alert('Geolocation을 지원하지 않는 브라우저입니다.');
  }
};
const copyLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation을 지원하지 않는 브라우저입니다.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latVal = position.coords.latitude;
      const lngVal = position.coords.longitude;
      currentLocation.value = { lat: latVal, lng: lngVal };

      const text = `${latVal}, ${lngVal}`;
      try {
        await navigator.clipboard.writeText(text);
        alert('📌 위치 좌표가 복사되었습니다!');
      } catch (err) {
        alert('❌ 복사 실패: ' + err);
      }
    },
    (error) => {
      alert('❌ 위치 정보를 가져올 수 없습니다.');
      console.error(error);
    }
  );
};

</script>

<style scoped>
.section-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 8px;
  border-bottom: 1px solid #ccc;}

.section-btn {
 background: white;
  border: none;
  padding: 6px 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.section-btn.active {
  background-color:#003366;
  color: white;
  border-radius: 6px;
}
</style>