<template>
  <div class="agency-list-page">
    <!-- 검색&정렬 -->
    <div class="search-sort-row">
      <AgencySearchBar @search="onSearch" />
      <SortSelect v-model="sortBy" />
    </div>

    <!-- 리스트 -->
    <ul class="agency-list">
      <li v-for="(agency, idx) in pagedList" :key="agency.officeId">
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

    <MapFloatingButtonWithModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AgencySearchBar from '@/pages/agency/components/AgencySearchBar.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import AgencyCard from '@/pages/agency/components/AgencyCard.vue'
import MapFloatingButtonWithModal from '@/pages/agency/components/MapFloatingButtonWithModal.vue'
import axios from 'axios'
import { getAgencyImage } from '@/components/utils/agencyImage' 
const agencies = ref([])

const route = useRoute()
const router = useRouter()

// 페이지네이션 상태
const pageSize = 10
const page = ref(Math.max(1, parseInt(route.query.page ?? '1', 10) || 1))

onMounted(async () => {
  try {
    // 중개사무소 목록 조회
    const res = await axios.get(`http://localhost:8080/api/agent/list`)

    agencies.value = (res.data || []).map(a => ({
      ...a,
      _img: getAgencyImage(
        a.profileUrl || a.profileImage || a.imageUrl || '',
        String(a.officeId)
      ),
    }))
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})

const searchText = ref('')
const sortBy = ref('trust')
watch(sortBy, () => { page.value = 1 })

function onSearch(val) {
  searchText.value = val
  page.value = 1
}

const filteredList = computed(() =>
  searchText.value
    ? agencies.value.filter(a =>
        (a.officeName || '').toLowerCase().includes(searchText.value.trim().toLowerCase()) ||
        (a.address || '').toLowerCase().includes(searchText.value.trim().toLowerCase())
      )
    : agencies.value
)

const sortedList = computed(() => {
  const list = [...filteredList.value]
  if (sortBy.value === 'trust') {
    return list.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
  }
  return list.sort((a, b) => (a.officeName || '').localeCompare(b.officeName || '', 'ko'))
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedList.value.length / pageSize)))

const pagedList = computed(() =>
  sortedList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const maxPageDisplay = 5

const startPage = computed(() => {
  // 현재 블록의 시작 번호 (1, 6, 11, ...)
  return Math.floor((page.value - 1) / maxPageDisplay) * maxPageDisplay + 1
})
const endPage = computed(() => {
  // 끝 번호가 전체 페이지를 넘지 않도록
  return Math.min(startPage.value + maxPageDisplay - 1, totalPages.value)
})
const pageNumbers = computed(() => {
  // 시작~끝까지 배열 반환
  return Array.from({ length: endPage.value - startPage.value + 1 }, (_, i) => startPage.value + i)
})

// 페이지 이동 함수
function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

// page가 바뀌면 URL ?page= 갱신 (히스토리 누적 없이)
watch(page, (p) => {
  const q = { ...route.query, page: String(p) }
  router.replace({ query: q })
})

// 브라우저 뒤로가기 등으로 URL이 바뀌면 page 반영
watch(() => route.query.page, (q) => {
  const p = Math.max(1, parseInt(q ?? '1', 10) || 1)
  if (p !== page.value) page.value = p
})

// 데이터/검색/정렬 변화로 총 페이지 수가 줄면 현재 페이지 보정
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
