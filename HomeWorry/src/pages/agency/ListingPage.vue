<template>
  <div>
    <SimpleHeader :title="agency.office_name || ''" />

    <div class="listing-page">
      <!-- 유형/정렬 필터 -->
      <ListingFilterBar
        v-model:modelValueTypes="selectedTypes"
        v-model:modelValueSort="sortMode"
      />

      <!-- 매물 리스트 -->
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

      <!-- 비어있을 때 -->
      <div v-if="displayedListings.length === 0" class="empty-msg bodyMedium20px">
        등록된 매물이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import ListingCard from '@/pages/agency/components/ListingCard.vue'
import ListingFilterBar from '@/pages/agency/components/ListingFilterBar.vue'

import { getListingImage } from '@/components/utils/listingImage'

const route = useRoute()
const officeId = route.query.agencyId || route.params.agencyId || '1'

const agency = ref({ office_name: '' })
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/agent/${officeId}`)
    agency.value.office_name = res.data.officeName || res.data.office_name || ''
  } catch (e) {
    console.error('중개사 정보 로드 실패:', e)
  }
})

const listings = ref([])

const selectedTypes = ref(['MONTHLY', 'JEONSE', 'SALE'])
const sortMode = ref('server') // 'server' | 'priceAsc' | 'priceDesc'

const TRANSACTION_TYPE_MAP = {
  MONTHLY: ['월세', 'monthly', 'rent', 'month'],
  JEONSE: ['전세', 'jeonse', 'charter'],
  SALE: ['매매', 'sale', 'trade']
}

/* 거래유형 정규화 */
function normalizeType(item) {
  const raw = item?.transactionType ? String(item.transactionType).toLowerCase() : ''
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => raw.includes(k))) return type
  }
  // price 문자열이 유형 접두어일 때 보조 추론
  const p = String(item?.price ?? '').toLowerCase()
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => p.startsWith(k))) return type
  }
  return 'SALE'
}

/* 정렬 보조 */
const typeRank = { MONTHLY: 0, JEONSE: 1, SALE: 2 }
const num = x => (Number.isFinite(+x) ? +x : 0)

/* 가격 오름차순 정렬 보증금(또는 매매가) 우선, 월세는 2차 비교 */
function cmpPriceAsc(a, b) {
  const ta = normalizeType(a), tb = normalizeType(b)
  const a1 = ta === 'SALE' ? num(a.salePrice ?? a.deposit) : num(a.deposit)
  const b1 = tb === 'SALE' ? num(b.salePrice ?? b.deposit) : num(b.deposit)
  if (a1 !== b1) return a1 - b1
  const a2 = ta === 'MONTHLY' ? num(a.monthlyRent) : 0
  const b2 = tb === 'MONTHLY' ? num(b.monthlyRent) : 0
  if (a2 !== b2) return a2 - b2
  // 안정화
  return (typeRank[ta] ?? 99) - (typeRank[tb] ?? 99) || (num(a.id) - num(b.id))
}
const cmpPriceDesc = (a, b) => -cmpPriceAsc(a, b)

/* 필터 + 정렬 적용 결과 */
const displayedListings = computed(() => {
  const filtered = listings.value.filter(l => selectedTypes.value.includes(normalizeType(l)))
  const arr = [...filtered]
  if (sortMode.value === 'server') return arr
  if (sortMode.value === 'priceAsc') return arr.sort(cmpPriceAsc)
  if (sortMode.value === 'priceDesc') return arr.sort(cmpPriceDesc)
  return arr
})

/* 리스트 이미지 소스 결정 */
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

/* 초기 매물 목록 로드 */
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/listing/getAgencyList/${officeId}`)
    listings.value = (res.data || []).map(it => ({
      ...it,
      _img: getListingImage(it.housingType, seedOf(it), primaryImageOf(it))
    }))
  } catch (e) {
    alert('매물 목록 불러오기에 실패했습니다.')
  }
})
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
