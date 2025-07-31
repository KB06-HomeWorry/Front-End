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
          :img="sampleImgs[idx % sampleImgs.length]"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AgencySearchBar from '@/pages/agency/components/AgencySearchBar.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import AgencyCard from '@/pages/agency/components/AgencyCard.vue'

import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'
import axios from 'axios'

const sampleImgs = [profile1, profile2, profile3]

// 테스트용 더미 데이터
// const agencies = ref([
//   { id: 1, name: '청운공인중개사', address: '서울시 구로구 새말로 20', phone: '02-1234-5678', trustScore: 95 },
//   { id: 2, name: '삼성공인중개사', address: '서울시 금천구 벚꽃로 123', phone: '02-8765-4321', trustScore: 77 },
//   { id: 3, name: '효성공인중개사', address: '서울시 구로구 디지털로 100', phone: '02-1111-2222', trustScore: 88 },
//   { id: 4, name: '강남공인중개사', address: '서울시 강남구 테헤란로 10', phone: '02-3333-4444', trustScore: 92 },
//   { id: 5, name: '미래공인중개사', address: '서울시 관악구 신림로 22', phone: '02-5555-1234', trustScore: 80 },
//   { id: 6, name: '신성공인중개사', address: '서울시 영등포구 여의도길 99', phone: '02-6789-1234', trustScore: 87 },
//   { id: 7, name: '한빛공인중개사', address: '서울시 중랑구 봉화로 56', phone: '02-9999-0000', trustScore: 75 },
//   { id: 8, name: '드림공인중개사', address: '서울시 동작구 사당로 87', phone: '02-2323-2323', trustScore: 83 },
//   { id: 9, name: '마포공인중개사', address: '서울시 마포구 월드컵로 240', phone: '02-0101-0101', trustScore: 90 },
//   { id: 10, name: '푸른공인중개사', address: '서울시 서초구 서초대로 74', phone: '02-8989-5656', trustScore: 70 }
// ])

const agencies = ref([])

// 페이지네이션 상태
const page = ref(1)
const pageSize = 20

onMounted(async () => {
  try {
    // 중개사무소 목록 조회
    const res = await axios.get(`http://localhost:8080/api/agent/list`)
    agencies.value = res.data
    
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})

const searchText = ref('')
const sortBy = ref('trust') 

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
  if (sortBy.value === 'trust') {
    return list.sort((a, b) => b.totalScore - a.totalScore)
  }
  return list.sort((a, b) => a.officeName.localeCompare(b.officeName, 'ko'))
})

const totalPages = computed(() =>
  Math.ceil(sortedList.value.length / pageSize)
)

const pagedList = computed(() =>
  sortedList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const maxPageDisplay = 5;

const startPage = computed(() => {
  // 현재 블록의 시작 번호 (1, 6, 11, ...)
  return Math.floor((page.value - 1) / maxPageDisplay) * maxPageDisplay + 1;
});
const endPage = computed(() => {
  // 끝 번호가 전체 페이지를 넘지 않도록
  return Math.min(startPage.value + maxPageDisplay - 1, totalPages.value);
});
const pageNumbers = computed(() => {
  // 시작~끝까지 배열 반환
  return Array.from({ length: endPage.value - startPage.value + 1 }, (_, i) => startPage.value + i);
});

// 페이지 이동 함수
function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}
</script>

<style scoped>
.agency-list-page {
  max-width: 480px;
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
