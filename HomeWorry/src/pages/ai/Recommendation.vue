<script>
import axios from "axios";

export default {
  data() {
    return {
      recommendedListings: [],
      loading: false,
      error: null,
      likedListings: [],  // 찜한 매물 ID 리스트 저장용
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const userToken = localStorage.getItem("user-token");
      if (!userToken) {
        this.error = "로그인 후 이용해주세요.";
        this.loading = false;
        return;
      }

      // 1. 찜한 매물 목록 받아오기 (id만 추출)
      const res = await axios.get(`http://localhost:8080/api/listing/favorite/${userToken}`);
      console.log("찜한 매물 목록 응답:", res.data);
      this.likedListings = res.data.map(item => item.id);  // id 배열로 변환

      if (this.likedListings.length === 0) {
        this.error = "찜한 매물이 없습니다.";
        this.loading = false;
        return;
      }

      // 2. 추천 API에 찜한 매물 id 리스트 보내서 추천 매물 받기
      const recRes = await axios.post("http://localhost:8000/recommend", {
        likedListings: this.likedListings,
      });

      this.recommendedListings = recRes.data.recommendations;
      console.log("추천 매물 목록:", this.recommendedListings);

    } catch (e) {
      this.error = "추천 매물 불러오기 실패";
      console.error(e);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div>
    <h2>추천 매물</h2>
    <div v-if="recommendedListings.length > 0 && !loading" class="cards-container">
      <div v-for="item in recommendedListings" :key="item.id" class="card">
        <h3 class="card-title">{{ item.listing }}</h3>
        <p><strong>보증금:</strong> {{ item.deposit.toLocaleString() }} 만원</p>
        <p><strong>임대 조건:</strong> {{ item.rental_condition }}</p>
        <p><strong>상세 내용:</strong> {{ item.details }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
}

.card {
  background-color: #fdfdfd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  width: 280px;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  color: #333;
}

p {
  margin: 6px 0;
  color: #555;
}

</style>