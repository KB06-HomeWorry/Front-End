<template>
  <div>
    <SimpleHeader title="저장된 매물" />
    <div class="bookmark-page">

      <div v-if="pagedList.length > 0" class="listing-list-grid">
        <ListingBookmarkCard
          v-for="(listing, idx) in pagedList"
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import ListingBookmarkCard from '@/pages/mypage/components/ListingBookmarkCard.vue'
import SortSelect from '@/pages/agency/components/SortSelect.vue'
import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'

const sampleImgs = [profile1, profile2, profile3]

const listings = ref([])
const userToken = localStorage.getItem('user-token')

// 정렬/페이지네이션 상태
const sortBy = ref('name')         // 'price', 'date' 등으로 확장 가능
const page = ref(1)
const pageSize = 8                 // 1페이지에 8개씩
const maxPageDisplay = 5           // 하단 페이지버튼 5개씩

onMounted(() => {
  fetchListingList()
})

async function fetchListingList(){
  try {
    // 북마크 된 매물 목록 조회
    const res = await axios.get(`http://localhost:8080/api/listing/favorite/${userToken}`)
    listings.value = res.data
  } catch (e) {
    alert('찜한 매물 목록을 불러오지 못했습니다.')
  }
}

const sortedList = computed(() => listings.value)

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
      await axios.delete(`/api/listing/${id}/disFavorite/${userToken}`)
    } else {
      // [북마크 등록]
      await axios.get(`/api/listing/${id}/favorite/${userToken}`)
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
