<template>
  <div class="not-found-page">
    <img :src="page404" alt="404페이지">
    <div class="button">
    <Btn161px35px text="이전 페이지로 돌아가기"  @click="goBack"/>
  </div>
  </div>
</template>

<script setup>
import page404 from '@/assets/icons/page_404.png'
import Btn161px35px from '@/components/button/Btn161px35px.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back(); 
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 6.5rem 1rem;
}
.button {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
}
</style>
