<template>
  <div class="app-wrapper">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>

<style scoped>
.app-wrapper {
  max-width: 393px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-top: 60px;
  flex: 1;
  padding-bottom: 70px;
}
</style>
