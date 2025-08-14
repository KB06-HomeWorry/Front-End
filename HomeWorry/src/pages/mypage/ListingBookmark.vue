<template>
  <div>
    <SimpleHeader title="저장된 매물 목록" />

    <div class="bookmark-page">
      <ListingFilterBar
        v-model:modelValueTypes="selectedTypes"
        v-model:modelValueSort="sortMode"
      />
      <div v-if="pagedList.length > 0" class="listing-list-grid">
        <ListingBookmarkCard
          v-for="(listing) in pagedList"
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
          :isFavorite="true"
          :onToggleFavorite="toggleFavorite"
        />
      </div>
      <div v-else class="empty-msg bodyMedium20px">
        북마크 된 매물이 없습니다.
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination bodyMedium12px" v-if="totalPages > 1">
        <button :disabled="page === 1" @click="goToPage(1)">≪</button>
        <button :disabled="page === 1" @click="goToPage(page - 1)">이전</button>
        <button
          v-for="p in pageNumbers"
          :key="p"
          :class="{ active: page === p }"
          @click="goToPage(p)"
        >{{ p }}</button>
        <button :disabled="page === totalPages" @click="goToPage(page + 1)">다음</button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)">≫</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import ListingFilterBar from '@/pages/agency/components/ListingFilterBar.vue'
import ListingBookmarkCard from '@/pages/mypage/components/ListingBookmarkCard.vue'
import { getListingImage } from '@/components/utils/listingImage'

const listings = ref([])
const userToken = localStorage.getItem('user-token')

// 정렬/페이지네이션 상태
const sortBy = ref('name')
const page = ref(1)
const pageSize = 8
const maxPageDisplay = 5

onMounted(() => {
  fetchListingList()
})

async function fetchListingList(){
  try {
    // 북마크 된 매물 목록 조회
    const res = await axios.get(`http://localhost:8080/api/listing/favorite`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })

    listings.value = (res.data || []).map(it => ({
      ...it,
      _img: getListingImage(it),
    }))
  } catch (e) {
    alert('찜한 매물 목록을 불러오지 못했습니다.')
  }
}

/* 필터 상태 */
const selectedTypes = ref(['MONTHLY','JEONSE','SALE'])
const sortMode = ref('server')

const TRANSACTION_TYPE_MAP = {
  MONTHLY: ['월세', 'monthly', 'rent', 'month'],
  JEONSE:  ['전세', 'jeonse', 'charter'],
  SALE:    ['매매', 'sale', 'trade']
}
const typeRank = { MONTHLY: 0, JEONSE: 1, SALE: 2 }
const num = (x) => Number.isFinite(+x) ? +x : 0
function normalizeType(item) {
  const raw = item?.transactionType ? String(item.transactionType).toLowerCase() : ''
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => raw.includes(k))) return type
  }
  const p = String(item?.price ?? '').toLowerCase()
  for (const [type, keywords] of Object.entries(TRANSACTION_TYPE_MAP)) {
    if (keywords.some(k => p.startsWith(k))) return type
  }
  return 'SALE'
}

function cmpDefault(a, b) {
  const ta = normalizeType(a), tb = normalizeType(b)
  const ra = typeRank[ta] ?? 99, rb = typeRank[tb] ?? 99
  if (ra !== rb) return ra - rb

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
  return num(a.id) - num(b.id)
}

function cmpPriceAsc(a, b) {
  const ta = normalizeType(a), tb = normalizeType(b)
  const a1 = ta === 'SALE' ? num(a.salePrice ?? a.deposit) : num(a.deposit)
  const b1 = tb === 'SALE' ? num(b.salePrice ?? b.deposit) : num(b.deposit)
  if (a1 !== b1) return a1 - b1
  const a2 = ta === 'MONTHLY' ? num(a.monthlyRent) : 0
  const b2 = tb === 'MONTHLY' ? num(b.monthlyRent) : 0
  if (a2 !== b2) return a2 - b2
  return (typeRank[ta] ?? 99) - (typeRank[tb] ?? 99) || (num(a.id) - num(b.id))
}
const cmpPriceDesc = (a, b) => -cmpPriceAsc(a, b)

/* 필터 + 정렬 적용된 목록 */
const sortedList = computed(() => {
  const filtered = listings.value.filter(l =>
    selectedTypes.value.includes(normalizeType(l))
  )
  const arr = [...filtered]
  if (sortMode.value === 'server') return arr
  if (sortMode.value === 'default') return arr.sort(cmpDefault)
  if (sortMode.value === 'priceAsc') return arr.sort(cmpPriceAsc)
  if (sortMode.value === 'priceDesc') return arr.sort(cmpPriceDesc)
  return arr
})

/* 필터/정렬 바뀌면 첫 페이지로 */
watch([selectedTypes, sortMode], () => { page.value = 1 })

const totalPages = computed(() =>
  Math.ceil(sortedList.value.length / pageSize)
)

const pagedList = computed(() =>
  sortedList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const startPage = computed(() => Math.floor((page.value - 1) / maxPageDisplay) * maxPageDisplay + 1)
const endPage = computed(() => Math.min(startPage.value + maxPageDisplay - 1, totalPages.value))
const pageNumbers = computed(() =>
  Array.from({ length: endPage.value - startPage.value + 1 }, (_, i) => startPage.value + i)
)

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

async function toggleFavorite(id, isFavorite) {
  try {
    if (isFavorite) {
      // [북마크 해제]
      await axios.delete(`/api/listing/${id}/disFavorite`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
    } else {
      // [북마크 등록]
      await axios.get(`/api/listing/${id}/favorite`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
    }
  } catch (e) {
    alert('북마크 처리 중 오류가 발생했습니다.')
  } finally {
    fetchListingList()
  }
}
</script>

<style scoped>
.bookmark-page {
  max-width: 480px;
  margin: 0 1.5rem;
  padding: 16px 0 40px 0;
  min-height: 80vh;
}

.listing-list-grid {
  display: grid;
  grid-template-columns: repeat(1fr);
  gap: 6px;
}
.empty-msg {
  text-align: center;
  color: var(--color-mediumgray);
  margin: 50px 0 0 0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin: 18px 0 0 0;
}
.pagination button {
  border: none;
  background: var(--color-lightgray2);
  border-radius: 6px;
  min-width: 28px;
  min-height: 28px;
  padding: 0 8px;
  cursor: pointer;
  color: var(--color-primary3);
  transition: background .15s;
}
.pagination button.active,
.pagination button:active {
  background: var(--color-primary);
  color: #fff;
}
.pagination button[disabled] {
  opacity: .5;
  cursor: not-allowed;
}
</style>
