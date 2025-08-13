<template>
  <div>
  <SimpleHeader :title="`${agency.office_name || ''}`" />
  <div class="listing-page">
    <ListingFilterBar
      v-model:modelValueTypes="selectedTypes"
      v-model:modelValueSort="sortMode"
    />

    <div class="listing-list">
      <ListingCard
        v-for="listing in displayedListings"
        :key="listing.id"
        :id="listing.id"
        :transactionType="listing.transactionType"
        :deposit="listing.deposit"
        :monthlyRent="listing.monthlyRent"
        :address="listing.address"
        :housingType="listing.housingType"
        :areaInfo="listing.areaInfo"
        :floorInfo="listing.floorInfo"
        :direction="listing.direction"
        :img="listing._img" 
      />
    </div>
    <div v-if="displayedListings.length === 0" class="empty-msg bodyMedium20px">
      등록된 매물이 없습니다.
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios'
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import ListingCard from '@/pages/agency/components/ListingCard.vue'; 
import ListingFilterBar from '@/pages/agency/components/ListingFilterBar.vue'
import { getListingImage } from '@/components/utils/listingImage'

const route = useRoute()

const listings = ref([]);
const officeId = route.query.agencyId || route.params.agencyId || '1'

// 중개사 정보 상태
const agency = ref({
  office_name: ''
})

// 페이지 진입 시 중개사 정보 불러오기
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/agent/${officeId}`)
   agency.value.office_name = res.data.officeName || res.data.office_name || ''
  } catch (e) {
    console.error('중개사 정보 로드 실패:', e)
  }
})

/* 필터 상태 */
const selectedTypes = ref(['MONTHLY','JEONSE','SALE'])
const sortMode = ref('server') // 'server' | 'default' | 'priceAsc' | 'priceDesc'

/* 거래유형 매핑 규칙 */
const TRANSACTION_TYPE_MAP = {
  MONTHLY: ['월세', 'monthly', 'rent', 'month'],
  JEONSE:  ['전세', 'jeonse', 'charter'],
  SALE:    ['매매', 'sale', 'trade']
}

/* 거래유형 정규화 */
function normalizeType(item) {
  const raw = item?.transactionType ? String(item.transactionType).toLowerCase() : ''
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => raw.includes(k))) return type
  }
  // price 문자열 보조 추론
  const p = String(item?.price ?? '').toLowerCase()
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => p.startsWith(k))) return type
  }
  return 'SALE'
}
const typeRank = { MONTHLY: 0, JEONSE: 1, SALE: 2 }
const num = (x) => Number.isFinite(+x) ? +x : 0

/* 정렬 로직 */
function cmpDefault(a, b) {
  const ta = normalizeType(a), tb = normalizeType(b)
  const ra = typeRank[ta] ?? 99, rb = typeRank[tb] ?? 99
  if (ra !== rb) return ra - rb

  // 같은 타입 내 세부 규칙
  if (ta === 'MONTHLY') {
    const da = num(a.deposit), db = num(b.deposit)
    if (da !== db) return da - db
    const ma = num(a.monthlyRent), mb = num(b.monthlyRent)
    if (ma !== mb) return ma - mb
  } else if (ta === 'JEONSE') {
    const da = num(a.deposit), db = num(b.deposit)
    if (da !== db) return da - db
  } else { // SALE
    const sa = num(a.salePrice ?? a.deposit)
    const sb = num(b.salePrice ?? b.deposit)
    if (sa !== sb) return sa - sb
  }
  // 완전 동률이면 id로 안정화
  return num(a.id) - num(b.id)
}

function cmpPriceAsc(a, b) {
  const ta = normalizeType(a), tb = normalizeType(b)
  const a1 = ta === 'SALE' ? num(a.salePrice ?? a.deposit) : num(a.deposit)
  const b1 = tb === 'SALE' ? num(b.salePrice ?? b.deposit) : num(b.deposit)
  if (a1 !== b1) return a1 - b1

  // 월세면 월세금으로 2차 비교
  const a2 = ta === 'MONTHLY' ? num(a.monthlyRent) : 0
  const b2 = tb === 'MONTHLY' ? num(b.monthlyRent) : 0
  if (a2 !== b2) return a2 - b2

  // 안정화
  return (typeRank[ta] ?? 99) - (typeRank[tb] ?? 99) || (num(a.id) - num(b.id))
}
const cmpPriceDesc = (a, b) => -cmpPriceAsc(a, b)

/* 필터 + 정렬 적용 */
const displayedListings = computed(() => {
  const filtered = listings.value.filter(l => selectedTypes.value.includes(normalizeType(l)))
  const arr = [...filtered]
  if (sortMode.value === 'server') return arr
  if (sortMode.value === 'default') return arr.sort(cmpDefault)
  if (sortMode.value === 'priceAsc') return arr.sort(cmpPriceAsc)
  if (sortMode.value === 'priceDesc') return arr.sort(cmpPriceDesc)
  return arr
})

/* 서버 이미지/시드 준비 */
function primaryImageOf(item) {
  return (
    item.mainImage ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images.length ? item.images[0] : null)
  )
}
function seedOf(item) {
  return String(item.id ?? item.address ?? item.listing ?? '')
}

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/listing/getAgencyList/${officeId}`)
    listings.value = (res.data || []).map(it => ({
      ...it,
      _img: getListingImage(it.housingType, seedOf(it), primaryImageOf(it)),
    }))
  } catch (e) {
    alert("매물 목록 불러오기에 실패했습니다.")
  }
});
</script>

<style scoped>
.listing-page {
  max-width: 393px;
  margin: 1rem 1.5rem;
}
.listing-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.empty-msg {
  color: var(--color-primary);
  text-align: center;
  margin-top: 30px;
}
</style>