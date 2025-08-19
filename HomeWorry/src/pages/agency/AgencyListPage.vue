<template>
  <div>
    <SimpleHeader title="중개사무소">
      <!-- 우측 액션 버튼 -->
      <template #action>
        <button
          class="agency-bookmark-btn"
          @click="goBookmark"
          aria-label="북마크 페이지로 이동"
          title="내 북마크"
        >
          <img :src="bookmarkIcon" alt="북마크" class="agency-bookmark-img" />
        </button>
      </template>
    </SimpleHeader>

    <div class="agency-list-page">
      <!-- 검색 + 정렬 -->
      <div class="search-sort-row">
        <AgencySearchBar @search="onSearch" />
        <SortSelect v-model="sortBy" />
      </div>

      <!-- 중개사 리스트 -->
      <ul class="agency-list">
        <li v-for="(agency) in pagedList" :key="agency.officeId">
          <AgencyCard
            :id="agency.officeId"
            :name="agency.officeName"
            :address="agency.address"
            :phone="agency.phone"
            :trustScore="agency.totalScore"
            :img="agency._img"
          />
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <div class="pagination bodyMedium12px" v-if="totalPages > 1">
        <button type="button" :disabled="page === 1" @click="goToPage(1)">≪</button>
        <button type="button" :disabled="page === 1" @click="goToPage(page - 1)">이전</button>
        <button
          v-for="p in pageNumbers"
          :key="p"
          type="button"
          :class="{ active: page === p }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
        <button type="button" :disabled="page === totalPages" @click="goToPage(page + 1)">다음</button>
        <button type="button" :disabled="page === totalPages" @click="goToPage(totalPages)">≫</button>
      </div>

      <!-- 지도 플로팅 버튼 -->
      <MapFloatingButtonWithModal />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import AgencySearchBar from '@/pages/agency/components/AgencySearchBar.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import AgencyCard from '@/pages/agency/components/AgencyCard.vue'
import MapFloatingButtonWithModal from '@/pages/agency/components/MapFloatingButtonWithModal.vue'
import axios from 'axios'
import { getAgencyImage } from '@/components/utils/agencyImage'

import bookmarkIcon from '@/assets/icons/bookmark_box.png'

const route = useRoute()
const router = useRouter()

const agencies = ref([])

/* 페이지네이션 */
const pageSize = 8
const page = ref(Math.max(1, parseInt(route.query.page ?? '1', 10) || 1))

/* 검색/정렬 상태 */
const searchText = ref('')
const sortBy = ref('trust') // 'trust' | 'name'

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/agent/list`)
    agencies.value = (res.data || []).map(a => ({
      ...a,
      _img: getAgencyImage(
        a.profileUrl || a.profileImage || a.imageUrl || '',
        String(a.officeId)
      )
    }))
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})

/* 정렬 변경 시 페이지 초기화 */
watch(sortBy, () => { page.value = 1 })

function onSearch(val) {
  searchText.value = val
  page.value = 1
}

// 오른쪽 북마크 페이지 이동
function goBookmark() {
  router.push('/my/agency/bookmark')
}

const filteredList = computed(() =>
  searchText.value
    ? agencies.value.filter(a => {
        const q = searchText.value.trim().toLowerCase()
        return (a.officeName || '').toLowerCase().includes(q) ||
               (a.address || '').toLowerCase().includes(q)
      })
    : agencies.value
)

// 한국어 자연 정렬 + 숫자 인식
const collator = new Intl.Collator('ko', {
  numeric: true,
  sensitivity: 'base'
})

function bucketAndKey(name) {
  const s = (name ?? '').trim()
  if (!s) return { bucket: 1, key: '' }

  const first = s[0]
  const isAlphaNumHangul = /[0-9A-Za-z가-힣]/.test(first)
  const bucket = isAlphaNumHangul ? 0 : 1 
  const key = bucket === 0 ? s : s.replace(/^[^0-9A-Za-z가-힣]+/, '')
  return { bucket, key }
}

const sortedList = computed(() => {
  const list = [...filteredList.value]
  if (sortBy.value === 'trust') {
    return list.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
  }
  // 이름순 특수문자 시작은 뒤로
  return list.sort((a, b) => {
    const A = bucketAndKey(a.officeName)
    const B = bucketAndKey(b.officeName)
    if (A.bucket !== B.bucket) return A.bucket - B.bucket
    return collator.compare(A.key, B.key)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedList.value.length / pageSize)))

const pagedList = computed(() =>
  sortedList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const maxPageDisplay = 5
const startPage = computed(() =>
  Math.floor((page.value - 1) / maxPageDisplay) * maxPageDisplay + 1
)
const endPage = computed(() =>
  Math.min(startPage.value + maxPageDisplay - 1, totalPages.value)
)
const pageNumbers = computed(() =>
  Array.from({ length: endPage.value - startPage.value + 1 }, (_, i) => startPage.value + i)
)

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

watch(page, (p) => {
  const q = { ...route.query, page: String(p) }
  router.replace({ query: q })
})

watch(() => route.query.page, (q) => {
  const p = Math.max(1, parseInt(q ?? '1', 10) || 1)
  if (p !== page.value) page.value = p
})

/* 데이터/검색/정렬 변화로 총 페이지 수가 줄면 페이지 보정 */
watch([sortedList, totalPages], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})
</script>

<style scoped>
.agency-list-page {
  position: relative;
  max-width: 393px;
  margin: 0 1rem;
  background: #fff;
  padding: 16px 0;
}

/* SimpleHeader 우측 버튼 자리 확보 (제목과 겹침 방지) */
:deep(.simple-header) {
  padding-right: 44px; /* 우측 아이콘 폭 + 여유 */
}

/* 우측 상단 고정 액션 버튼 */
.agency-bookmark-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.agency-bookmark-img {
  width: 22px;
  height: 22px;
  margin-top: 1px;
  display: block;
}

.search-sort-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding: 0 12px;
}
.search-sort-row > *:first-child {
  flex: 1;
  min-width: 0;
}
.search-sort-row > *:last-child {
  flex-shrink: 0;
}

.agency-list {
  list-style: none;
  padding: 0 12px;
  margin: 0;
}
.agency-list li {
  padding: 0;
  border: none;
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
  color: var(--color-primary);
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
