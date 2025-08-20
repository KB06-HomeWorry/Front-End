<template>
  <SimpleHeader title="시세 상세페이지" />
  <div class="price-detail-container">
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

    <section ref="listing">
      <div class="location-info-card">
        <div class="menu-list titleBold20px">시세정보</div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">거래가격</div>
          <div class="info-value titleBold16px">{{ price }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">주택유형</div>
          <div class="info-value bodyMedium14px">{{ housingType }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">거래유형</div>
          <div class="info-value bodyMedium14px">{{ dealType }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">계약일</div>
          <div class="info-value bodyMedium14px">{{ contractDay }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">건물명</div>
          <div class="info-value bodyMedium14px">{{ buildingName }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">전용면적</div>
          <div class="info-value bodyMedium14px">{{ areaInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">토지면적</div>
          <div class="info-value bodyMedium14px">{{ landAreaInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">해당층</div>
          <div class="info-value bodyMedium14px">{{ floorInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">준공년도</div>
          <div class="info-value bodyMedium14px">{{ builtYearInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">위치</div>
          <div class="info-value bodyMedium14px">{{ locationInfo }}</div>
        </div>
        <div class="info-row">
          <div class="info-label bodyMedium14px">주소</div>
          <div class="info-value bodyMedium14px">{{ addressInfo }}</div>
        </div>
      </div>
    </section>
    <template v-if="bpImg">
        <div class="menu-list titleBold20px">평면도</div>    
        <img
        :src="bpImg"
        @error="onImgError"
        alt="평면도"
        style="
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: cover;
          margin-bottom: 10px;
        "
      />
    </template>
    <div class="map-container">
      <DetailLocation
        :lat="trendlat"
        :lng="trendlng"
        :address="addressInfo"
        :showReportButton="false"
      >
      </DetailLocation>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailLocation from '@/pages/map/components/DetailLocation.vue';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import { getListingImage } from '@/components/utils/listingImage';

const router = useRouter();
const route = useRoute();

const trendlat = ref(null);
const trendlng = ref(null);
const trendprice = ref('');
const priceDetailData = ref({});

const roomImg = ref('');
const bpImg = ref('');

function onImgError() {
  const imageResult = getListingImage(
    housingType.value,
    String(route.params.priceTrendId)
  );

  if (typeof imageResult === 'object' && imageResult.flat && imageResult.blueprint) {
    roomImg.value = imageResult.flat;
    bpImg.value = imageResult.blueprint;
  } else {
    roomImg.value = imageResult;
    bpImg.value = '';
  }
}

// 가격 억대로 표현
const price = computed(() => {
  if (!priceDetailData.value?.price) return '-';
  return formatKoreanPrice(priceDetailData.value.price);
});

const housingType = computed(() => {
  return priceDetailData.value?.housingType || '-';
});

const areaInfo = computed(() => {
  if (!priceDetailData.value?.archArea) return '-';
  return `${priceDetailData.value.archArea}㎡`;
});

const floorInfo = computed(() => {
  if (!priceDetailData.value?.floor) return '-';
  return `${priceDetailData.value.floor}층`;
});

const dealType = computed(() => {
  return priceDetailData.value?.dealType || '-';
});

const contractDay = computed(() => {
  return priceDetailData.value?.contractDay || '-';
});

const buildingName = computed(() => {
  return priceDetailData.value?.buildingName || '-';
});

const landAreaInfo = computed(() => {
  if (!priceDetailData.value?.landArea) return '-';
  return `${priceDetailData.value.landArea}㎡`;
});

const builtYearInfo = computed(() => {
  if (!priceDetailData.value?.builtYear) return '-';
  return priceDetailData.value.builtYear.toString().split('.')[0]; // Remove decimal part
});

const locationInfo = computed(() => {
  if (priceDetailData.value?.districtName && priceDetailData.value?.dongName) {
    return `${priceDetailData.value.districtName} ${priceDetailData.value.dongName}`;
  }
  return '-';
});

const addressInfo = computed(() => {
  return priceDetailData.value?.address || '-';
});

/**  숫자를 스트링화 해서 출력 */
function formatKoreanPrice(price) {
  const num = Number(price);
  if (isNaN(num) || num === 0) return '-';
  const eok = num / 100000000;
  if (eok % 1 === 0) return `${eok}억`;
  return `${parseFloat(eok.toFixed(1))}억`;
}

const priceTrendId = route.params.priceTrendId;

onMounted(async () => {
  const priceTrendId = route.params.priceTrendId;
  if (!priceTrendId) {
    console.log('priceTrendId 없음');
    return;
  }

  try {
    const endpoint2 = `/api/pricetrend/${priceTrendId}`;
    const response2 = await fetch(endpoint2);
    const data2 = await response2.json();

    trendlat.value = data2.latitude;
    trendlng.value = data2.longitude;
    trendprice.value = data2.price;
    priceDetailData.value = data2;
    // 서버 이미지 우선, 없으면 유틸이 타입/시드로 폴백
    const primaryImage =
      data2.mainImage ||
      data2.imageUrl ||
      (Array.isArray(data2.images) && data2.images.length
        ? data2.images[0]
        : null);

    const seedKey = String(
      data2.id ??
        route.params.priceTrendId ??
        data2.address ??
        data2.listing ??
        ''
    );
    const imageResult = getListingImage(housingType.value, seedKey, primaryImage);
    if (typeof imageResult === 'object' && imageResult.flat && imageResult.blueprint) {
      roomImg.value = imageResult.flat;
      bpImg.value = imageResult.blueprint;
    } else {
      roomImg.value = imageResult;
    }
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
    roomImg.value = getListingImage(
      housingType.value,
      String(route.params.priceTrendId)
    );
  }
});
</script>

<style scoped>
.price-detail-container {
  padding: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}

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
