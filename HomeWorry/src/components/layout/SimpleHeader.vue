<template>
  <header class="simple-header">
    <button class="back-btn" @click="goBack" aria-label="뒤로가기">
      <img :src="leftArrow" alt="뒤로가기" class="arrow-img" />
    </button>
    <span class="header-title bodyMedium16px">{{ title }}</span>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import leftArrow from '@/assets/icons/back.png' 

const props = defineProps({
  title: { type: String, required: true }
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.simple-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-white);
  z-index: 100;
  max-width: 393px;
  width: 100%;
  margin: 0 auto;
  border-bottom: 0.5px solid var(--color-light);
  padding: 14px 12px;
}


.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 8px;
  display: flex;
  align-items: center;
    height: 100%;
}

.arrow-img {
  width: 24px; 
  height: 24px;
    display: block;
}

.header-title {
  display: flex;
  align-items: center; 
  color: var(--color-primary);
  height: 100%;
  line-height: 60px;
  margin-top: 3px;
}
</style>
