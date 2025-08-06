<template>
  <div>
    <SimpleHeader title="매물 상세페이지">
      <template #action>
        <button
          class="bookmark-btn"
          @click="toggleBookmark"
          aria-label="북마크"
          :title="isFavorite ? '북마크 해제' : '북마크 등록'"
        >
          <img
            :src="isFavorite ? bookmarkOn : bookmarkOff"
            alt="북마크"
            class="bookmark-icon"
          />
        </button>
      </template>
    </SimpleHeader>    
    <img
      :src="roomImg"
      alt="매물 이미지"
      style="width: 100%; height: auto; max-height: 200px; object-fit: cover; margin-bottom: 10px;"
    />
    <section>
      <div>
        <span class="buildname bodyMedium16px">{{ buildingName }}</span>
      </div>
      <div>
        <span class="price titleBold20px">{{ price }}</span>
      </div>
    </section>

    <div class="section-bar">
      <button @click="scrollTo('listing')" :class="['section-btn titleBold14px', { active: activeSection === 'listing' }]">매물정보</button>
      <button @click="scrollTo('location')" :class="['section-btn titleBold14px', { active: activeSection === 'location' }]">위치정보</button>
    </div>

    <section ref="listing">
      <div class="location-info-card">
        <div class="menu-list titleBold20px">매물정보</div>
        <div class="info-row">
          <div class="info-label bodyMedium16px">거래방식</div>
          <div class="info-value bodyMedium14px">{{ price }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium16px">건물형태</div>
          <div class="info-value bodyMedium14px">{{ housingType }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium16px">전용/계약면적</div>
          <div class="info-value bodyMedium14px">{{ areaInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium16px">해당층/전체층</div>
          <div class="info-value bodyMedium14px">{{ floorInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium16px">방향</div>
          <div class="info-value bodyMedium14px">{{ direction }}</div>
        </div>
      </div>
    </section>
    <hr class="full-width-hr" />
    <section ref="location">
      <DetailLocation />
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
  <section ref="agency"> </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
import { ref, onMounted } from 'vue';
import roomImg from '@/assets/icons/room.png';
import DetailLocation from '@/pages/map/components/DetailLocation.vue';
import DetailAgency from '@/pages/map/components//DetailAgency.vue';
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import bookmarkOn from '@/assets/icons/star_filled.png'
import bookmarkOff from '@/assets/icons/star_outline.png'

const router = useRouter();
const route = useRoute();

const lat = ref(null);
const lng = ref(null);
const price = ref('');
const buildingName = ref('');
const deposit = ref('');
const rent = ref('');
const housingType = ref('');
const floorInfo = ref('');
const areaInfo = ref('');
const direction = ref('');

const activeSection = ref('deal');
const isFavorite = ref(false);
const userToken = localStorage.getItem('user-token');

// 매물 id는 params로 받아옴
const listingId = route.params.listingId;

// 북마크 여부 조회
async function fetchFavoriteStatus() {
  try {
    const res = await fetch(`/api/listing/${userToken}/isFavorite/${listingId}`);
    isFavorite.value = await res.json();
  } catch {
    isFavorite.value = false;
  }
}

// 북마크 토글
async function toggleBookmark() {
  try {
    if (isFavorite.value) {
      await fetch(`/api/listing/${userToken}/favorite/${listingId}`, { method: 'DELETE' });
      isFavorite.value = false;
    } else {
      await fetch(`/api/listing/${userToken}/favorite/${listingId}`);
      isFavorite.value = true;
    }
  } catch {
    alert('북마크 처리 중 오류가 발생했습니다.');
  }
}

// 쿼리가 아니라 params에서 id 받아오는 것으로 수정
onMounted(async () => {
  const id = listingId;
  if (!id) {
    console.error('❌ id 없음');
    return;
  }

  try {
    const endpoint = `/api/listing/${id}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    lat.value = data.latitude;
    lng.value = data.longitude;
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

    // 북마크 상태 불러오기
    await fetchFavoriteStatus();
  } catch (error) {
    console.error('❌ 상세정보 로딩 실패:', error);
  }
});

// section scroll
const deal = ref(null);
const listing = ref(null);
const location = ref(null);

function scrollTo(section) {
  activeSection.value = section;
  const targetRef = { deal, listing, location }[section];
  targetRef?.value?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.bookmark-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0 0 6px;
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 2px;
}
.bookmark-icon {
  width: 28px;
  height: 28px;
  display: block;
}

.section-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 8px;
  border-bottom: 1px solid #bdbdbd;
}
.section-btn {
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
.section-btn.active {
  background-color: var(--color-primary);
  color: var(--color-white);
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
  background: var(--color-white);
  padding: 24px 20px 18px 20px;
  max-width: 420px;
  margin: 0 auto;
}


/* 좌측 라벨 / 우측 값 2열 배치 */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 12px;
  border-top: 1px solid #f4f4f4;
}
.info-row:first-of-type {
  border-top: none;
}
.info-label {
  color: var(--color-mediumgray);
  min-width: 96px;
  flex-shrink: 0;
}
.info-value {
  text-align: right;
  flex: 1;
  word-break: keep-all;
}

/* 카드 너비(원하면 전체 너비로) */
.location-info-card {
  background-color: var(--color-white);
  padding: 24px 20px 18px 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* 아래 구분선 */
.full-width-hr {
  border: none;
  border-top: 1px solid;
  color: var(--color-mediumgray);
  margin: 16px 0;
  width: 100%;
}
.menu-list {
  color: var(--color-primary);
}
</style>
