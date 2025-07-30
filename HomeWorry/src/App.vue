<template>
  <div class="app-wrapper">
    <Header v-if="!hideHeader"/>
    <main class="main-content">
      <RouterView />
    </main>
    <Footer v-if="!hideFooter"/>
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 필요 페이지에서 Header/Footer 숨기기 위해 추가함
const hideHeader = computed(() => !!route.meta.hideHeader)
const hideFooter = computed(() => !!route.meta.hideFooter)
</script>

<style scoped>
.app-wrapper {
  min-width: 393px;
  /* width: 100%; */
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 70px;
}
.main-content.has-header {
  padding-top: 60px;
}
</style>
