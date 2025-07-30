<template>
  <div class="bookmark-page">
    <div v-if="agencies.length > 0" class="agency-list-grid">
      <BookmarkCard
        v-for="(agency, idx) in agencies"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookmarkCard from '@/pages/mypage/components/BookmarkCard.vue'
import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'

const sampleImgs = [profile1, profile2, profile3]

const userId = localStorage.getItem('userId') || '1'

const agencies = ref([])

// 목데이터
const mockAgencies = [
  {
    id: 1,
    officeName: "행복공인중개사",
    address: "서울특별시 강남구 논현동 123-4",
    profileUrl: "",
    isFavorite: true,
  },
  {
    id: 2,
    officeName: "드림공인중개사",
    address: "서울특별시 서초구 서초동 11-22",
    profileUrl: "",
    isFavorite: true,
  },
  {
    id: 3,
    officeName: "에이스공인중개사",
    address: "서울특별시 마포구 합정동 88-3",
    profileUrl: "",
    isFavorite: true,
  },
  {
    id: 4,
    officeName: "청운공인중개사",
    address: "서울특별시 강서구 화곡동 55-99",
    profileUrl: "",
    isFavorite: true,
  },
]

onMounted(() => {
  agencies.value = mockAgencies
})

async function toggleFavorite(id) {
  const idx = agencies.value.findIndex(a => a.id === id)
  if (idx === -1) return
  agencies.value.splice(idx, 1)
}
</script>

<style scoped>
.bookmark-page {
  max-width: 480px;
  margin: 1rem 2rem;
  padding: 16px 0 40px 0;
  min-height: 80vh;
}

.agency-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 12px;
  padding: 0 10px;
}

.empty-msg {
  text-align: center;
  color: var(--color-mediumgray, #a7a7a7);
  margin: 50px 0 0 0;
  font-size: 16px;
}
</style>
