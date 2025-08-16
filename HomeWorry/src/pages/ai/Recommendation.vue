<script>
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('user-token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default {
  data() {
    return {
      recommendedListings: [],
      loading: false,
      error: null,
      likedListings: [], // 찜한 매물 ID 리스트
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const userToken = localStorage.getItem('user-token');
      if (!userToken) {
        this.error = '로그인 후 이용해주세요.';
        return;
      }

      // 1) 찜한 매물 목록 조회
      const favRes = await api.get('/listing/favorite');
      console.log('찜한 매물 목록 응답:', favRes.data);

      this.likedListings = (favRes.data ?? []).map((item) => item.id);

      if (this.likedListings.length === 0) {
        this.error = '찜한 매물이 없습니다.';
        return;
      }

      // 2) 추천 요청 (별도 추천 서버)
      const recApiBase = 'http://localhost:8000';
      const recRes = await axios.post(`${recApiBase}/recommend`, {
        likedListings: this.likedListings,
      });

      this.recommendedListings = recRes.data?.recommendations ?? [];
      console.log('추천 매물 목록:', this.recommendedListings);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 404) {
        this.error =
          '요청 경로를 찾을 수 없습니다. API 경로 또는 프록시 설정을 확인해주세요.';
      } else if (e.response?.status === 401) {
        this.error = '인증이 필요합니다. 다시 로그인해 주세요.';
      } else {
        this.error = '추천 매물 불러오기 실패';
      }
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div>
    <h2>추천 매물</h2>

    <div v-if="loading">불러오는 중...</div>
    <div v-else-if="error" style="color: #bf0000">{{ error }}</div>

    <div v-else-if="recommendedListings.length > 0" class="cards-container">
      <div v-for="item in recommendedListings" :key="item.id" class="card">
        <h3 class="card-title">{{ item.listing }}</h3>
        <p>
          <strong>보증금:</strong>
          {{ Number(item.deposit || 0).toLocaleString() }} 만원
        </p>
        <p><strong>임대 조건:</strong> {{ item.rental_condition }}</p>
        <p><strong>상세 내용:</strong> {{ item.details }}</p>
      </div>
    </div>

    <div v-else>추천 결과가 없습니다.</div>
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 280px;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
