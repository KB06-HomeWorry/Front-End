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
      @error="onImgError"
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

      <section ref="location" v-if="lat != null && lng != null">
        <DetailLocation
          :lat="Number(lat)"
          :lng="Number(lng)"
          :address="listingAddress"
        />
      </section>

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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import DetailLocation from '@/pages/map/components/DetailLocation.vue'
import DetailAgency from '@/pages/map/components/DetailAgency.vue'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import bookmarkOn from '@/assets/icons/heart_filled.png'
import bookmarkOff from '@/assets/icons/heart_outline.png'
import { getListingImage } from '@/components/utils/listingImage' 

const route = useRoute()
const listingId = route.params.listingId

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
const listingAddress=ref('');

const isFavorite = ref(false)
const heartAnim = ref(false)
const userToken = localStorage.getItem('user-token')
const agency = ref(null)

// 초기엔 시드 기반 기본 폴백을 먼저(깜빡임 방지)
const roomImg = ref(getListingImage('', String(listingId)))

// 이미지 에러 시 타입/시드 기반 폴백으로 즉시 교체
function onImgError() {
  roomImg.value = getListingImage(housingType.value, String(listingId))
}

// 즐겨찾기 상태
async function fetchFavoriteStatus() {
  try {
    const res = await axios.get(`/api/listing/${listingId}/isFavorite`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
    isFavorite.value = !!res.data
  } catch {
    isFavorite.value = false
  }
}
async function toggleBookmark() {
  heartAnim.value = false
  void heartAnim.value
  heartAnim.value = true
  try {
    if (isFavorite.value) {
      await axios.delete(`/api/listing/${listingId}/disFavorite`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
      isFavorite.value = false
    } else {
      await axios.get(`/api/listing/${listingId}/favorite`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
      isFavorite.value = true
    }
  } catch {
    alert('북마크 처리 중 오류가 발생했습니다.')
  }
}

// 상세 데이터 로딩
onMounted(async () => {
  if (!listingId) {
    console.error('❌ id 없음')
    return
  }

  try {
    const response = await fetch(`/api/listing/${listingId}`)
    const data = await response.json()

    lat.value = data.latitude;
    lng.value = data.longitude;
    price.value = data.monthlyRent
      ? `월세 ${data.deposit}/${data.monthlyRent}`
      : `전세 ${data.deposit}`
    buildingName.value = data.listing
    deposit.value = data.deposit
    rent.value = data.monthlyRent
    housingType.value = data.housingType
    floorInfo.value = data.floorInfo
    areaInfo.value = data.areaInfo ? data.areaInfo.replace(/m$/, 'm²') : ''
    direction.value = data.direction
    listingAddress.value = data.address || ''

    // 서버 이미지 우선, 없으면 유틸이 타입/시드로 폴백
    const primaryImage =
      data.mainImage ||
      data.imageUrl ||
      (Array.isArray(data.images) && data.images.length ? data.images[0] : null)

    const seedKey = String(data.id ?? listingId ?? data.address ?? data.listing ?? '')
    roomImg.value = getListingImage(housingType.value, seedKey, primaryImage)

    await fetchFavoriteStatus()
    await fetchAgency()
  } catch (error) {
    console.error('❌ 상세정보 로딩 실패:', error)
    roomImg.value = getListingImage(housingType.value, String(listingId))
  }
});

async function fetchAgency() {
  try {
    const res = await axios.get(`/api/listing/getAgency/${listingId}`)
    agency.value = res.data
  } catch {
    alert('중개사무소 데이터를 불러오지 못했습니다.')
  }
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
  background-color: var(--color-white);
  padding: 10px 0;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  max-width: 100%;
}

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
