<template>
  <div class="home-root">
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

    <!-- 카드뉴스 부분 추후 컴포넌트로 구현 예정 (width 100% - height 200px) -->
    <div class="card-news-placeholder"></div>

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
        @click="() => go('ai/estate-ease')"
      />
      <HomeBtnSmall
        text="부동산<br/>용어 퀴즈"
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
import { useRouter } from "vue-router";
import HomeBtn80px from "@/pages/home/components/HomeBtn80px.vue";
import HomeBtnLg from "@/pages/home/components/HomeBtnLg.vue";
import HomeBtnMed from "@/pages/home/components/HomeBtnMed.vue";
import HomeBtnSmall from "@/pages/home/components/HomeBtnSmall.vue";
import { useChecklistStore } from "@/stores/checklist";

// 🔹 이미지 import
import homeApartment from "@/assets/icons/home_apartment.png";
import homeOneroom from "@/assets/icons/home_oneroom.png";
import homeVilla from "@/assets/icons/home_villa.png";
import homeOfficetel from "@/assets/icons/home_officetel.png";

import homeAi from "@/assets/icons/home_ai.png";
import homeAnalysis from "@/assets/icons/home_analysis.png";

import checklistRent from "@/assets/icons/checklist_rent.png";
import checklistSale from "@/assets/icons/checklist_sale.png";

import homeChatbot from "@/assets/icons/home_chatbot.png";
import homeQuiz from "@/assets/icons/home_quiz.png";
import homeCalculator from "@/assets/icons/home_calculator.png";

const router = useRouter();
const go = (path) => router.push(path);

const checklistStore = useChecklistStore();
const handleCategoryClick = (category) => {
  if (category === "전.월세 체크리스트" || category === "매매 체크리스트") {
    const mappedType = category === "전.월세 체크리스트" ? "전/월세" : "매매";

    console.log(mappedType);
    const query = {
      type: (checklistStore.checklistData.type = mappedType),
      stage: "계약 전",
      userId: checklistStore.checklistData.userId,
    };

    router.push({ path: "/checklist-stage", query });
  }
};
</script>

<style scoped>
.home-root {
  width: 393px;
  /* max-width: 420px; */
  margin: 0 auto;
  padding: 14px 16px 8px 16px;
  box-sizing: border-box;
}

.home-btn-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.home-btn-lg-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 10px 0;
}

.card-news-placeholder {
  width: 393px;
  height: 200px;
  margin: 14px -16px;
  background: rgba(17, 31, 92, 0.1);
}
</style>
