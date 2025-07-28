<template>
  <div class="not-found-page">
    <SimpleHeader title="테스트 심플헤더"/>
    <span>잘못된 경로로 접근했습니다</span>

    <BtnLg text="메인페이지로 이동" @click="goToHome" />

    <div class="divider" />

    <span>버튼 테스트</span>

    <div class="btn-test-section">
      <!-- 기본 버튼 테스트 -->
      <BtnLg
        text="전.월세 계약 체크리스트"
        :icon="checklistIcon"
        @click="handleClick('홈')"
      />
      <BtnLgShort
        text="원.투룸"
        :icon="checklistIcon"
        @click="handleClick('홈')"
      />
      <BtnLgShort
        text="상가.사무실"
        :icon="checklistIcon"
        @click="handleClick('홈')"
      />
      <BtnMed text="분석 시작하기" @click="handleClick('기본')" />
      <BtnSm text="저장하기" @click="handleClick('기본')" />
      <BtnMedSlim text="동일했습니다" @click="handleClick('기본')" />
      <BtnSmSlim text="친절했어요" @click="handleClick('기본')" />
      <BtnTiny text="로그인/회원가입" @click="handleClick('기본')" />


      <!-- 흰 배경 버튼 테스트 -->
      <BtnMed text="흰색 버튼" color="#ffffff" @click="handleClick('흰색')" />
      <BtnSm text="저장하기" color="#ffffff" @click="handleClick('흰색')" />


    </div>
  </div>
</template>

<script setup>
import BtnLg from '@/components/button/BtnLg.vue';
import BtnLgShort from '@/components/button/BtnLgShort.vue';
import BtnMed from '@/components/button/BtnMed.vue';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';
import BtnSm from '@/components/button/BtnSm.vue';
import BtnSmSlim from '@/components/button/BtnSmSlim.vue';
import BtnTiny from '@/components/button/BtnTiny.vue';
import SimpleHeader from '@/components/layout/SimpleHeader.vue'

import checklistIcon from '@/assets/icons/checklist_1.png';

import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
  router.push({ name: 'home' });
}

function handleClick(type) {
  alert(`[${type}] 버튼이 클릭되었습니다`);
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ddd;
}

.btn-test-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
}
</style>
