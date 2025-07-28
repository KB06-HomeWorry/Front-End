<template>
  <div class="agency-list-page">
    <!-- 검색&정렬 -->
    <div class="search-sort-row">
      <AgencySearchBar @search="onSearch" />
      <SortSelect v-model="sortBy" />
    </div>

    <!-- 리스트 -->
    <ul class="agency-list">
      <li v-for="(agency, idx) in sortedList" :key="agency.id">
        <AgencyCard
          :name="agency.name"
          :address="agency.address"
          :phone="agency.phone"
          :trustScore="agency.trustScore"
          :img="sampleImgs[idx % sampleImgs.length]"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AgencySearchBar from '@/pages/agency/components/AgencySearchBar.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import AgencyCard from '@/pages/agency/components/AgencyCard.vue'

import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'

const sampleImgs = [profile1, profile2, profile3]

// 테스트용 더미 데이터
const agencies = ref([
  { id: 1, name: '청운공인중개사', address: '서울시 구로구 새말로 20', phone: '02-1234-5678', trustScore: 95 },
  { id: 2, name: '삼성공인중개사', address: '서울시 금천구 벚꽃로 123', phone: '02-8765-4321', trustScore: 77 },
  { id: 3, name: '효성공인중개사', address: '서울시 구로구 디지털로 100', phone: '02-1111-2222', trustScore: 88 },
  { id: 4, name: '강남공인중개사', address: '서울시 강남구 테헤란로 10', phone: '02-3333-4444', trustScore: 92 },
  { id: 5, name: '미래공인중개사', address: '서울시 관악구 신림로 22', phone: '02-5555-1234', trustScore: 80 },
  { id: 6, name: '신성공인중개사', address: '서울시 영등포구 여의도길 99', phone: '02-6789-1234', trustScore: 87 },
  { id: 7, name: '한빛공인중개사', address: '서울시 중랑구 봉화로 56', phone: '02-9999-0000', trustScore: 75 },
  { id: 8, name: '드림공인중개사', address: '서울시 동작구 사당로 87', phone: '02-2323-2323', trustScore: 83 },
  { id: 9, name: '마포공인중개사', address: '서울시 마포구 월드컵로 240', phone: '02-0101-0101', trustScore: 90 },
  { id: 10, name: '푸른공인중개사', address: '서울시 서초구 서초대로 74', phone: '02-8989-5656', trustScore: 70 }
])


const searchText = ref('')
const sortBy = ref('trust') 

function onSearch(val) {
  searchText.value = val
}

const filteredList = computed(() =>
  searchText.value
    ? agencies.value.filter(a =>
        a.name.toLowerCase().includes(searchText.value.trim().toLowerCase()) ||
        a.address.toLowerCase().includes(searchText.value.trim().toLowerCase())
      )
    : agencies.value
)

const sortedList = computed(() => {
  if (sortBy.value === 'trust') {
    return [...filteredList.value].sort((a, b) => b.trustScore - a.trustScore)
  }
  return [...filteredList.value].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
})
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
</style>
