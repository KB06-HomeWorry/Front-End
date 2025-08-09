<template>
  <header class="app-header">
    <!-- 좌측 텍스트 -->
    <div class="header-left titleBold24px">
      집걱정단
    </div>

    <!-- 우측 버튼 -->
    <div class="header-right">
      <BtnTiny text="중개사 전용" color="#ffffff" @click="onTinyClick" />
    </div>
  </header>
</template>

<script setup>
import BtnTiny from '@/components/button/BtnTiny.vue' // 경로는 실제 위치에 맞게 조정

function onTinyClick() {
  console.log('BtnTiny 클릭됨')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;                /* 높이 지정 */
  padding: 0 16px;             /* 좌우 여백 */
  background-color: var(--color-primary);
  border-bottom: 1px solid #ddd;
}

.header-left {
  color: var(--color-white);
}

.header-right {
  display: flex;
  align-items: center;
}
</style>
