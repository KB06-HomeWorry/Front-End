<template>
  <div>
    <!-- <button @click="goBackToMap"><</button> -->
    <img :src="roomImg" alt="매물 이미지" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; margin-bottom: 10px;"/>
    <section>
        <div><span class="title-text">{{ buildingName }}</span></div>
        <div><span class="price-text">{{ price }}</span></div>

    </section>
    <!-- <section>
        <h2>실거래가</h2>
        <h3>계약일 층 거래 정보</h3>
    </section> -->

    <div class="section-bar">
      <!-- <button @click="scrollTo('deal')" :class="['section-btn', { active: activeSection === 'deal' }]">거래정보</button> -->
      <button @click="scrollTo('listing')" :class="['section-btn', { active: activeSection === 'listing' }]">매물정보</button>
      <button @click="scrollTo('location')" :class="['section-btn', { active: activeSection === 'location' }]">위치정보</button>
    </div>
    <!-- <section ref="deal">
      <h3 style="font-size: 20px; font-weight: bold;">거래정보</h3>
      <h3>거래방식 {{ price }}</h3>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 16px 0;" />
    </section> -->

    <!-- code1 -->
<section ref="listing">
  <div class="location-info-card">
    <h3 class="titleBold16px">매물정보</h3>

    <div class="info-row">
      <div class="info-label">거래방식</div>
      <div class="info-value">{{ price }}</div>
    </div>

    <div class="info-row">
      <div class="info-label">건물형태</div>
      <div class="info-value">{{ housingType }}</div>
    </div>

    <div class="info-row">
      <div class="info-label">전용/계약면적</div>
      <div class="info-value">{{ areaInfo }}</div>
    </div>

    <div class="info-row">
      <div class="info-label">해당층/전체층</div>
      <div class="info-value">{{ floorInfo }}</div>
    </div>

    <div class="info-row">
      <div class="info-label">방향</div>
      <div class="info-value">{{ direction }}</div>
    </div>
  </div>

  <hr class="full-width-hr" />
</section>

    <section ref="location">
      <DetailLocation/>
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
    <section ref="agency">
    
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
import { ref, onMounted } from 'vue';
import roomImg from '@/assets/icons/room.png';
import DetailLocation from './components/DetailLocation.vue';
import DetailAgency from './components/DetailAgency.vue';

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

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--color-primary);
}


.location-info-card {
  background: #fff;
  padding: 24px 20px 18px 20px;
  max-width: 420px;
  margin: 0 auto;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #111f5c;
  margin-bottom: 8px;
}

/* 좌측 라벨 / 우측 값 2열 배치 */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 12px;
  border-top: 1px solid #f4f4f4;  /* 각 행 구분선 (첫 행은 아래 규칙으로 제거) */
}
.info-row:first-of-type {
  border-top: none;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 96px;           /* 라벨 폭 고정 → 간격 일정 */
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  flex: 1;                   /* 남은 공간 사용 → 오른쪽 정렬 */
  word-break: keep-all;      /* 값 줄바꿈 시 단어 단위 */
}

/* 카드 너비(원하면 전체 너비로) */
.location-info-card {
  background: #fff;
  padding: 24px 20px 18px 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* 아래 구분선 */
.full-width-hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 16px 0;
  width: 100%;
}
.titleBold16px {
  font-size: 16px;
  font-weight: bold;
  color: #111f5c;
}

.bodyMedium12px {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.bodyMedium14px {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.title-text {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  color: #000;
}

.price-text {
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #000;
}
</style>