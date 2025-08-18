<template>
  <div class="app-wrapper">
    <Header v-if="!hideHeader" />
    <main class="main-content" :class="{ 'has-header': !hideHeader }">
      <RouterView v-slot="{ Component, route }">
        <KeepAlive>
          <component
            :is="Component"
            v-if="route.meta.keepAlive"
            :key="route.name"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-if="!route.meta.keepAlive"
          :key="route.name"
        />
      </RouterView>
    </main>
    <Footer v-if="!hideFooter" />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const hideHeader = computed(() => !!route.meta.hideHeader)
const hideFooter = computed(() => !!route.meta.hideFooter)

const authStore = useAuthStore()
onMounted(() => {
  authStore.restore()
})
</script>

<style scoped>
.app-wrapper {
  /* 정확히 393px로 고정 */
  width: 393px;
  min-width: 393px;
  max-width: 393px;

  margin: 0 auto;            /* 데스크톱에서 가운데 정렬 */
  min-height: 100vh;
  background-color: #fff;

  display: flex;
  flex-direction: column;

  /* 가로 스크롤 누수 방지 */
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding-bottom: 64px;
  overflow-x: hidden;
}
.main-content.has-header {
  padding-top: 60px;
}
</style>

<!-- 전역 규칙: 세로만 스크롤 허용 + 스크롤바 숨김 -->
<style>
/* 페이지 스크롤 정책 */
html, body {
  margin: 0;
  padding: 0;

  /* 가로 잠금, 세로만 */
  overflow-x: hidden;
  overflow-y: auto;

  /* 모바일 제스처/체인 방지 */
  overscroll-behavior-x: none;
  touch-action: pan-y;

  /* 텍스트 자동 확대 억제(iOS 대비) */
  -webkit-text-size-adjust: 100%;
}

/* 모든 스크롤바 숨김 (WebKit/Firefox/구Edge) */
*::-webkit-scrollbar {
  width: 0;
  height: 0;
}
* {
  -ms-overflow-style: none;   /* IE/Edge Legacy */
  scrollbar-width: none;      /* Firefox */
}
</style>
