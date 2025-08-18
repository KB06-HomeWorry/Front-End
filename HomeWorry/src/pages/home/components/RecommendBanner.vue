<template>
  <div class="banner-root">
    <div
      class="banner-header bodyMedium12px"
      :class="{ visible: isListingHeader }"
    >
      <img
        src="@/assets/icons/star_pin.png"
        alt="추천 아이콘"
        class="banner-icon"
      />
      <span class="highlight titleBold12px">{{ userName }}</span
      >님이 찾으시는
      <span class="highlight titleBold12px">&nbsp;조건과 유사한 매물</span>을
      추천드려요!
    </div>

    <div
      class="slider"
      ref="sliderRef"
      @mouseenter="pause()"
      @mouseleave="play()"
    >
      <div
        class="track"
        :style="{
          width: slideWidth * totalPages + 'px',
          transform: `translateX(-${slideWidth * currentPage}px)`,
          transition: animating ? 'transform 450ms ease' : 'none',
        }"
      >
        <div class="page" :style="{ width: slideWidth + 'px' }">
          <div class="ad-wrap">
            <img
              :src="adSrcSafe"
              alt="광고"
              class="ad-img"
              @error="onAdError"
            />
          </div>
        </div>

        <div
          v-for="(page, idx) in listPages"
          :key="'page-' + idx"
          class="page list-page"
          :style="{ width: slideWidth + 'px' }"
        >
          <div class="card-list">
            <RecommendCard
              v-for="(item, i) in page"
              :key="`${item.id ?? 'noid'}-${i}`"
              :item="item"
              :hydrate="true"
            />
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="dots">
        <button
          v-for="i in totalPages"
          :key="i"
          class="dot"
          :class="{ active: i - 1 === currentPage }"
          @click="go(i - 1)"
          :aria-label="`${i}번째 슬라이드로 이동`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RecommendCard from '@/pages/home/components/RecommendCard.vue';
import adImage from '@/assets/icons/home_ad.png';

// 메인 백엔드 API
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('user-token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// 추천 API
const recApi = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

// listingImage 정규화 사용
import { normalizeImgUrl } from '@/components/utils/listingImage';

export default {
  name: 'RecommendBanner',
  components: { RecommendCard },
  props: {
    userName: { type: String, default: '이름' },
    intervalMs: { type: Number, default: 3000 },
    adSrc: { type: String, default: adImage },
  },
  data() {
    return {
      allListings: [],
      currentPage: 0,
      timer: null,
      animating: true,
      slideWidth: 393,
      loading: false,
      error: null,
    };
  },
  computed: {
    // 6개 받아와서 3개씩 분할하여 2페이지로 표시
    listPages() {
      const src = (this.allListings || []).slice(0, 6);
      const out = [];
      for (let i = 0; i < src.length; i += 3) out.push(src.slice(i, i + 3));
      return out;
    },
    totalPages() {
      return 1 + this.listPages.length; // 광고 1장 + 리스트 페이지 수
    },
    isListingHeader() {
      return this.currentPage >= 1; // 2·3페이지에서만 헤더 보이기
    },
    adSrcSafe() {
      return normalizeImgUrl(this.adSrc || adImage);
    },
  },
  methods: {
    async fetchRecommendations() {
      this.loading = true;
      this.error = null;

      try {
        const userToken = localStorage.getItem('user-token');
        if (!userToken) {
          this.error = '로그인 후 이용해주세요.';
          this.allListings = [];
          this.stop();
          return;
        }

        // 북마크 목록
        const favRes = await api.get('/listing/favorite');

        const likedIdsRaw = Array.isArray(favRes.data)
          ? favRes.data.map((it) => it?.listingId ?? it?.id).filter(Boolean)
          : [];
        const likedIds = [...new Set(likedIdsRaw)];

        if (!likedIds.length) {
          this.error = '찜한 매물이 없습니다.';
          this.allListings = [];
          this.stop();
          return;
        }

        // 추천 API 호출
        const recRes = await recApi.post('/recommend', {
          likedListings: likedIds,
        });

        let rec = [];
        if (Array.isArray(recRes.data?.recommendations)) {
          rec = recRes.data.recommendations;
        } else if (Array.isArray(recRes.data?.ids)) {
          rec = recRes.data.ids.map((id) => ({ id }));
        } else if (Array.isArray(recRes.data)) {
          rec = recRes.data;
        }

        this.allListings = rec;
        if (this.totalPages <= 1) this.stop();
      } catch (e) {
        console.error('배너 추천 로드 실패:', e);
        if (e?.response?.status === 401) {
          this.error = '인증이 만료되었습니다. 다시 로그인해 주세요.';
        } else if (e?.response?.status === 404) {
          this.error =
            '요청 경로를 찾을 수 없습니다. API 경로/프록시 설정을 확인해 주세요.';
        } else {
          this.error = '추천 매물 불러오기 실패';
        }
        this.allListings = [];
        this.stop();
      } finally {
        this.loading = false;
      }
    },

    measure() {
      const el = this.$refs.sliderRef;
      if (el) this.slideWidth = Math.min(el.clientWidth || 393, 393);
    },
    next() {
      if (this.totalPages <= 1) return;
      this.animating = true;
      this.currentPage = (this.currentPage + 1) % this.totalPages;
    },
    go(i) {
      if (this.totalPages <= 1) return;
      this.animating = true;
      this.currentPage = i;
      this.restart();
    },
    play() {
      if (this.totalPages > 1) {
        this.stop();
        this.timer = setInterval(this.next, this.intervalMs);
      }
    },
    pause() {
      this.stop();
    },
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    onResize() {
      this.measure();
    },
    restart() {
      this.play();
    },
    onAdError(ev) {
      if (ev?.target) {
        ev.target.onerror = null;
        ev.target.src = adImage;
      }
    },
  },
  async mounted() {
    this.measure();
    window.addEventListener('resize', this.onResize);
    await this.fetchRecommendations();
    this.play();
  },
  beforeUnmount() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
  },
};
</script>

<style scoped>
.banner-root {
  position: relative;
  width: 100%;
  max-width: 393px;
  height: 200px;
  border-top: 1px solid var(--color-light);
  border-bottom: 1px solid var(--color-light);

  --header-h: 36px; /* 헤더 고정 높이 */
  --list-bottom-gap: 20px; /* 카드 영역 하단 여백 - 우하단 표식과 겹침 방지 */
}

.banner-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-h);
  padding: 8px 0;
  display: flex;
  align-items: center;
  color: var(--color-primary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 2;
  margin-left: 16px;
  margin-top: 4px;
}
.banner-header.visible {
  opacity: 1;
}
.banner-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  margin-bottom: 3px;
}
.highlight {
  color: var(--color-primary);
}

.slider {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #fff;
  z-index: 1;
}

.track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-page {
  align-items: flex-start;
  padding-top: calc(var(--header-h) + var(--header-gap));
  padding-bottom: var(--list-bottom-gap);
}

.ad-wrap {
  width: 100%;
  height: 100%;
}

.ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-list {
  --card-w: 110px;
  --gap: 16px;
  width: calc(var(--card-w) * 3 + var(--gap) * 2);
  display: flex;
  gap: var(--gap);
  justify-content: center;
  align-items: center;
}

.card-list :deep(.rec-card) {
  flex: 0 0 var(--card-w);
  width: var(--card-w);
  height: 137px;
}

.dots {
  position: absolute;
  right: 8px;
  left: auto;
  bottom: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary-10);
  border: none;
  cursor: pointer;
  padding: 0;
}
.dot.active {
  background: var(--color-primary);
}
</style>
