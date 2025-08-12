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
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();

// 필요 페이지에서 Header/Footer 숨기기 위해 추가함
const hideHeader = computed(() => !!route.meta.hideHeader);
const hideFooter = computed(() => !!route.meta.hideFooter);

const authStore = useAuthStore();
onMounted(() => {
  authStore.restore();
});
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