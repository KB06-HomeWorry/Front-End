<template>
  <div class="home-root">
    <teleport to="body">
      <transition name="toast-fade">
        <div
          v-if="toast.visible"
          class="toast-root"
          role="status"
          aria-live="polite"
        >
          <div class="toast-card bodyMedium14px">
            {{ toast.message }}
          </div>
        </div>
      </transition>
    </teleport>

    <div class="home-btn-row">
      <HomeBtn80px
        text="아파트"
        :icon="homeApartment"
        @click="() => go('/map/apartment')"
      />
      <HomeBtn80px
        text="원.투룸"
        :icon="homeOneroom"
        @click="() => go('/map/onetwo')"
      />
      <HomeBtn80px
        text="빌라.주택"
        :icon="homeVilla"
        @click="() => go('/map/building')"
      />
      <HomeBtn80px
        text="오피스텔"
        :icon="homeOfficetel"
        @click="() => go('/map/officetel')"
      />
    </div>

    <div class="home-btn-lg-col">
      <HomeBtnLg
        text="AI 계약서 분석"
        :icon="homeAi"
        desc="학습된 인공지능으로 거래 계약서에 숨어있는 독소조항을 찾아낼 수 있습니다."
        @click="go('/ai/analysis')"
      />
      <HomeBtnLg
        text="서류 분석"
        :icon="homeAnalysis"
        desc="매물 정보들을 입력하여 해당 매물의 위험도를 확인할 수 있습니다."
        @click="go('/analysis')"
      />
    </div>

    <div class="card-news-container">
      <RecommendBanner
        :user-name="userName"
        :interval-ms="3000"
        style="--header-gap:6px; --list-bottom-gap:20px;"
      />
    </div>

    <div class="home-btn-row" style="margin-bottom: 10px">
      <HomeBtnMed
        text="전.월세 체크리스트"
        :icon="checklistRent"
        @click="handleCategoryClick('전.월세 체크리스트')"
      />
      <HomeBtnMed
        text="매매 체크리스트"
        :icon="checklistSale"
        @click="handleCategoryClick('매매 체크리스트')"
      />
    </div>

    <div class="home-btn-row">
      <HomeBtnSmall
        text="부동산<br/>용어 해석"
        :icon="homeChatbot"
        @click="() => go('/ai/estate-ease')"
      />
      <HomeBtnSmall
        text="부동산<br/>지식 퀴즈"
        :icon="homeQuiz"
        @click="() => go('/quiz')"
      />
      <HomeBtnSmall
        text="중개수수료<br/>계산기"
        :icon="homeCalculator"
        @click="() => go('/calculator')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import HomeBtn80px from '@/pages/home/components/HomeBtn80px.vue';
import HomeBtnLg from '@/pages/home/components/HomeBtnLg.vue';
import HomeBtnMed from '@/pages/home/components/HomeBtnMed.vue';
import HomeBtnSmall from '@/pages/home/components/HomeBtnSmall.vue';
import { useChecklistStore } from '@/stores/checklist';
import { useAuthStore } from '@/stores/auth';

import RecommendBanner from '@/pages/home/components/RecommendBanner.vue';

import homeApartment from '@/assets/icons/home_apartment.png';
import homeOneroom from '@/assets/icons/home_oneroom.png';
import homeVilla from '@/assets/icons/home_villa.png';
import homeOfficetel from '@/assets/icons/home_officetel.png';

import homeAi from '@/assets/icons/home_ai.png';
import homeAnalysis from '@/assets/icons/home_analysis.png';

import checklistRent from '@/assets/icons/checklist_rent.png';
import checklistSale from '@/assets/icons/checklist_sale.png';

import homeChatbot from '@/assets/icons/home_chatbot.png';
import homeQuiz from '@/assets/icons/home_quiz.png';
import homeCalculator from '@/assets/icons/home_calculator.png';

const router = useRouter();
const go = (path) => router.push(path);

const token = localStorage.getItem('user-token');
const profile = ref({ name: '', email: '', phone: '' });

async function loadProfileIfNeeded() {
  if (!token) return;
  try {
    const { data } = await axios.get(
      `http://localhost:8080/member/getprofile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    profile.value = {
      name: data?.name ?? '',
    };
  } catch (e) {
    console.warn('프로필 로드 실패:', e);
  }
}

const toast = reactive({
  visible: false,
  message: '',
  timer: null,
});
function showToast(message, duration = 2500) {
  toast.message = message;
  toast.visible = true;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.visible = false;
  }, duration);
}

// 로그인 상태
const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.user || !!token);

const userName = computed(() => profile.value.name || '회원');

function cameFromLogin() {
  return sessionStorage.getItem('auth.justLoggedIn') === '1';
}
function clearLoginMarkers() {
  sessionStorage.removeItem('auth.justLoggedIn');
  sessionStorage.setItem('welcome.toast.shown', '1');
}

// 홈 최초 진입
onMounted(async () => {
  if (!isLoggedIn.value) return;
  await loadProfileIfNeeded();

  const alreadyShown = sessionStorage.getItem('welcome.toast.shown') === '1';
  if (cameFromLogin() && !alreadyShown) {
    showToast(`${userName.value}님, 반갑습니다 👋`);
    clearLoginMarkers();
  }
});

const checklistStore = useChecklistStore();
const handleCategoryClick = (category) => {
  if (category === '전.월세 체크리스트' || category === '매매 체크리스트') {
    const mappedType = category === '전.월세 체크리스트' ? '전/월세' : '매매';
    const query = {
      type: (checklistStore.checklistData.type = mappedType),
      stage: '계약 전',
      userId: (checklistStore.checklistData.userId = JSON.parse(localStorage.getItem('user')).userId),
    };
    router.push({ path: '/checklist-stage', query });
  }
};
</script>

<style scoped>
.home-root {
  width: 393px;
  margin: 0 auto;
  padding: 0px 16px 8px 16px;
  box-sizing: border-box;
}

.home-btn-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.home-btn-lg-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 10px 0;
}

.card-news-container {
  width: 393px;
  height: 200px; 
  margin: 14px -16px; /* 좌우 -16px로 홈 패딩을 상쇄하여 꽉 차게 하였음 */
}

.toast-root {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}
.toast-card {
  background: #f0f4ff;
  color: var(--color-primary);
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 240px;
  text-align: center;
  pointer-events: auto;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
