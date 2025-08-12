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
            :class="['bookmark-icon', { pop: heartAnim }]"
            @animationend="heartAnim = false"
            alt="북마크"
          />
        </button>
      </template>
    </SimpleHeader>
    <img
      :src="roomImg"
      alt="매물 이미지"
      style="
        width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: cover;
        margin-bottom: 10px;
      "
    />

    <div class="root">
      <!-- <section class="basic_info">
      <div>
        <span class="price titleBold20px">{{ price }}</span>
      </div>
      <div>
        <span class="buildname bodyMedium16px">{{ buildingName }}</span>
      </div>
    </section> -->

      <!-- <div class="section-bar">
      <button @click="scrollTo('listing')" :class="['section-btn titleBold14px', { active: activeSection === 'listing' }]">매물정보</button>
      <button @click="scrollTo('location')" :class="['section-btn titleBold14px', { active: activeSection === 'location' }]">위치정보</button>
    </div> -->

      <section ref="listing">
        <div class="location-info-card">
          <div class="menu-list titleBold20px">매물정보</div>
          <div class="info-row">
            <div class="info-label bodyMedium14px">거래방식</div>
            <div class="info-value titleBold16px">{{ price }}</div>
          </div>
          <div class="info-row">
            <div class="info-label bodyMedium14px">건물형태</div>
            <div class="info-value bodyMedium14px">{{ housingType }}</div>
          </div>
          <div class="info-row">
            <div class="info-label bodyMedium14px">전용/계약면적</div>
            <div class="info-value bodyMedium14px">{{ areaInfo }}</div>
          </div>
          <div class="info-row">
            <div class="info-label bodyMedium14px">해당층/전체층</div>
            <div class="info-value bodyMedium14px">{{ floorInfo }}</div>
          </div>
          <div class="info-row">
            <div class="info-label bodyMedium14px">방향</div>
            <div class="info-value bodyMedium14px">{{ direction }}</div>
          </div>
        </div>
      </section>
      <hr class="full-width-hr" />
      <!-- ListingDetail.vue (예시) -->
      <section ref="location" v-if="lat != null && lng != null">
        <DetailLocation
          :lat="Number(lat)"
          :lng="Number(lng)"
          :address="agency?.address || ''"
        />
      </section>
      <!-- <KakaoMap
      v-if="lat && lng"
      :lat="lat"
      :lng="lng"
      :level="3"
      style="width: 100%; height: 300px"
    >
      <KakaoMapMarker :lat="lat" :lng="lng" />
    </KakaoMap> -->
      <DetailAgency
        v-if="agency"
        :id="agency.officeId"
        :name="agency.officeName"
        :address="agency.address"
        :phone="agency.phone"
        :img="agency.profileImage"
      />
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
import { ref, onMounted } from 'vue';
import DetailLocation from '@/pages/map/components/DetailLocation.vue';
import DetailAgency from '@/pages/map/components/DetailAgency.vue';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import bookmarkOn from '@/assets/icons/heart_filled.png';
import bookmarkOff from '@/assets/icons/heart_outline.png';

import room from '@/assets/icons/room/room.png';
import room1 from '@/assets/icons/room/room1.png';
import room2 from '@/assets/icons/room/room2.png';
import room3 from '@/assets/icons/room/room3.png';
import room4 from '@/assets/icons/room/room4.png';
import room5 from '@/assets/icons/room/room5.png';
import room6 from '@/assets/icons/room/room6.png';
import room7 from '@/assets/icons/room/room7.png';

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
const heartAnim = ref(false); // 애니메이션용 변수
const userToken = localStorage.getItem('user-token');

const agency = ref(null); // 중개사 정보 추가

// 매물 id는 params로 받아옴
const listingId = route.params.listingId;

// 이미지 정의
const roomImages = [room1, room2, room3, room4, room5, room6, room7];
const roomImg = ref(null);

// 북마크 여부 조회
async function fetchFavoriteStatus() {
  try {
    const res = await axios.get(
      `/api/listing/${listingId}/isFavorite/${userToken}`
    );
    isFavorite.value = res.data;
  } catch (e) {
    isFavorite.value = false;
  }
}

// 북마크 토글
async function toggleBookmark() {
  // 애니메이션
  heartAnim.value = false;
  // 강제 reflow로 연속클릭시에도 애니 재생
  void heartAnim.value;
  heartAnim.value = true;

  try {
    if (isFavorite.value) {
      // [북마크 해제]
      await axios.delete(`/api/listing/${listingId}/disFavorite/${userToken}`);
      isFavorite.value = false;
    } else {
      // [북마크 등록]
      await axios.get(`/api/listing/${listingId}/favorite/${userToken}`);
      isFavorite.value = true;
    }
  } catch (e) {
    alert('북마크 처리 중 오류가 발생했습니다.');
  }
}

onMounted(async () => {
  const id = listingId;
  if (!id) {
    console.error('id 없음');
    return;
  }

  roomImg.value = roomImages[Math.floor(Math.random() * roomImages.length)];

  try {
    // 매물 상세 정보 요청
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
    areaInfo.value = data.areaInfo
      ? data.areaInfo.replace(/m$/, 'm²') // 끝의 m만 ㎡로 변경
      : '';
    direction.value = data.direction;

    // 북마크 상태 불러오기
    await fetchFavoriteStatus();

    // 중개사 정보 불러오기
    await fetchAgency();
  } catch (error) {
    console.error('❌ 상세정보 로딩 실패:', error);
  }
});

async function fetchAgency() {
  try {
    const res = await axios.get(`/api/listing/getAgency/${listingId}`);
    agency.value = res.data;
  } catch (error) {
    alert('중개사무소 데이터를 불러오지 못했습니다.');
  }
}

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
.root {
  margin: 0 1.5rem;
}

.basic_info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-mediumgray);
  padding-bottom: 12px;
}

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
  width: 22px;
  height: 22px;
  display: block;
  transition: filter 0.15s;
}
/* 애니메이션 */
@keyframes pop {
  0% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.bookmark-icon.pop {
  animation: pop 0.28s cubic-bezier(0.4, 2, 0.6, 1) both;
}

/* .section-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-mediumgray);
} */
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
  max-width: 100%;
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
  color: var(--color-darkgray);
  min-width: 96px;
  flex-shrink: 0;
}
.info-value {
  text-align: right;
  flex: 1;
  word-break: keep-all;
  color: var(--color-primary);
}

.location-info-card {
  background-color: var(--color-white);
  padding: 10px 0;
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
