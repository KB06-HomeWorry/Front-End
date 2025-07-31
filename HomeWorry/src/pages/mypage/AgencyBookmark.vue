<template>
  <div>
    <SimpleHeader title="저장된 공인중개사무소" />
    <div class="bookmark-page">
      <!-- 검색/정렬 -->
      <div class="search-sort-row">
        <AgencySearchBar @search="onSearch" />
        <SortSelect v-model="sortBy" />
      </div>

      <div v-if="pagedList.length > 0" class="agency-list-grid">
        <BookmarkCard
          v-for="(agency, idx) in pagedList"
          :key="agency.id"
          :id="agency.id"
          :officeName="agency.officeName"
          :address="agency.address"
          :imgUrl="agency.profileUrl"
          :isFavorite="agency.isFavorite"
          :onToggleFavorite="toggleFavorite"
          :img="sampleImgs[idx % sampleImgs.length]"
        />
      </div>
      <div v-else class="empty-msg">
        북마크 된 중개사무소가 없습니다.
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
import { ref, computed, onMounted } from 'vue'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import BookmarkCard from '@/pages/mypage/components/BookmarkCard.vue'
import AgencySearchBar from '@/pages/agency/components/AgencySearchBar.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'

const sampleImgs = [profile1, profile2, profile3]

// 실제 사용시 아래 mockAgencies → API 호출로 대체
const mockAgencies = [
  { id: 1, officeName: "행복공인중개사", address: "서울특별시 강남구 논현동 123-4", profileUrl: "", isFavorite: true },
  { id: 2, officeName: "드림공인중개사", address: "서울특별시 서초구 서초동 11-22", profileUrl: "", isFavorite: true },
  { id: 3, officeName: "에이스공인중개사", address: "서울특별시 마포구 합정동 88-3", profileUrl: "", isFavorite: true },
  { id: 4, officeName: "청운공인중개사", address: "서울특별시 강서구 화곡동 55-99", profileUrl: "", isFavorite: true },
  { id: 5, officeName: "센텀공인중개사", address: "부산광역시 해운대구 센텀로 7", profileUrl: "", isFavorite: true },
  { id: 6, officeName: "오렌지공인중개사", address: "대전광역시 유성구 봉명동 321-10", profileUrl: "", isFavorite: true },
  { id: 7, officeName: "금강공인중개사", address: "충청남도 천안시 서북구 두정동 110", profileUrl: "", isFavorite: true },
  { id: 8, officeName: "미래공인중개사", address: "서울특별시 관악구 신림동 101-5", profileUrl: "", isFavorite: true },
  { id: 9, officeName: "럭키공인중개사", address: "인천광역시 남동구 구월동 222-3", profileUrl: "", isFavorite: true },
  { id: 10, officeName: "스마트공인중개사", address: "경기도 수원시 권선구 세류동 99-4", profileUrl: "", isFavorite: true },
  // ... (테스트 데이터 10개 이상 추가하면 페이지네이션 작동 잘 확인 가능)
]

const agencies = ref([])

// 검색/정렬/페이지네이션 상태
const searchText = ref('')
const sortBy = ref('name')         // 'trust'도 가능, 예시에서는 가나다순 기본
const page = ref(1)
const pageSize = 8                 // 1페이지에 8개씩
const maxPageDisplay = 5           // 하단 페이지버튼 5개씩

onMounted(() => {
  agencies.value = mockAgencies   // 실제 사용시: API에서 데이터 불러와서 할당
})

function onSearch(val) {
  searchText.value = val
  page.value = 1
}

const filteredList = computed(() =>
  searchText.value
    ? agencies.value.filter(a =>
        a.officeName.toLowerCase().includes(searchText.value.trim().toLowerCase()) ||
        a.address.toLowerCase().includes(searchText.value.trim().toLowerCase())
      )
    : agencies.value
)

const sortedList = computed(() => {
  const list = [...filteredList.value]
  // (정렬 옵션 확장 시 여기에 추가, 지금은 가나다순만)
  return list.sort((a, b) => a.officeName.localeCompare(b.officeName, 'ko'))
})

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

async function toggleFavorite(id) {
  const idx = agencies.value.findIndex(a => a.id === id)
  if (idx === -1) return
  agencies.value.splice(idx, 1)
}
</script>

<style scoped>
.bookmark-page {
  max-width: 480px;
  margin: 0 2rem;
  padding: 16px 0 40px 0;
  min-height: 80vh;
}
.search-sort-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.search-sort-row > *:first-child {
  flex: 1;
  min-width: 0;
}
.search-sort-row > *:last-child {
  flex-shrink: 0;
}

.agency-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 12px;
}
.empty-msg {
  text-align: center;
  color: var(--color-mediumgray, #a7a7a7);
  margin: 50px 0 0 0;
  font-size: 16px;
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
