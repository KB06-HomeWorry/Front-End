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
        <AgencyBookmarkCard
          v-for="(agency, idx) in pagedList"
          :key="agency.officeId"
          :id="agency.officeId"
          :officeName="agency.officeName"
          :address="agency.address"
          :imgUrl="agency.profileImage"
          :isFavorite="true"
          :onToggleFavorite="toggleFavorite"
          :img="sampleImgs[idx % sampleImgs.length]"
        />
      </div>
      <div v-else class="empty-msg bodyMedium20px">
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
        >
          {{ p }}
        </button>
        <button :disabled="page === totalPages" @click="goToPage(page + 1)">
          다음
        </button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)">
          ≫
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SimpleHeader from "@/components/layout/SimpleHeader.vue";
import AgencyBookmarkCard from "@/pages/mypage/components/AgencyBookmarkCard.vue";
import AgencySearchBar from "@/pages/agency/components/AgencySearchBar.vue";
import SortSelect from "@/pages/agency/components/SortSelect.vue";
import profile1 from "@/assets/icons/sample_profile1.png";
import profile2 from "@/assets/icons/sample_profile2.png";
import profile3 from "@/assets/icons/sample_profile3.png";

const sampleImgs = [profile1, profile2, profile3];

const agencies = ref([]);
const userToken = localStorage.getItem("user-token");

// 검색/정렬/페이지네이션 상태
const searchText = ref("");
const sortBy = ref("name"); // 'trust'도 가능, 예시에서는 가나다순 기본
const page = ref(1);
const pageSize = 8; // 1페이지에 8개씩
const maxPageDisplay = 5; // 하단 페이지버튼 5개씩

onMounted(() => {
  fetchAgencyList();
});

async function fetchAgencyList() {
  try {
    // 북마크 목록 조회
    const res = await axios.get(
      `http://54.66.153.95:8080/api/agent/${userToken}/favorite`
    );
    agencies.value = res.data;
  } catch (e) {
    alert("북마크 목록을 불러오지 못했습니다.");
  }
}

function onSearch(val) {
  searchText.value = val;
  page.value = 1;
}

const filteredList = computed(() =>
  searchText.value
    ? agencies.value.filter(
        (a) =>
          a.officeName
            .toLowerCase()
            .includes(searchText.value.trim().toLowerCase()) ||
          a.address
            .toLowerCase()
            .includes(searchText.value.trim().toLowerCase())
      )
    : agencies.value
);

const sortedList = computed(() => {
  const list = [...filteredList.value];
  // (정렬 옵션 확장 시 여기에 추가, 지금은 가나다순만)
  return list.sort((a, b) => a.officeName.localeCompare(b.officeName, "ko"));
});

const totalPages = computed(() =>
  Math.ceil(sortedList.value.length / pageSize)
);

const pagedList = computed(() =>
  sortedList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);

const startPage = computed(
  () => Math.floor((page.value - 1) / maxPageDisplay) * maxPageDisplay + 1
);
const endPage = computed(() =>
  Math.min(startPage.value + maxPageDisplay - 1, totalPages.value)
);
const pageNumbers = computed(() =>
  Array.from(
    { length: endPage.value - startPage.value + 1 },
    (_, i) => startPage.value + i
  )
);

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p;
}

async function toggleFavorite(id, isFavorite) {
  try {
    if (isFavorite) {
      // [북마크 해제]
      await axios.delete(`/api/agent/${userToken}/favorite/${id}`);
    } else {
      // [북마크 등록]
      await axios.get(`/api/agent/${userToken}/favorite/${id}`);
    }
  } catch (e) {
    alert("북마크 처리 중 오류가 발생했습니다.");
  } finally {
    fetchAgencyList();
  }
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
  transition: background 0.15s;
}
.pagination button.active,
.pagination button:active {
  background: var(--color-primary);
  color: #fff;
}
.pagination button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
