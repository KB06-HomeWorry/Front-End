<template>
  <div class="app-wrapper">
    <header><Header /></header>
    <RouterView />
    <footer><Footer /></footer>
  </div>
</template>
<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>
<style scoped>
.app-wrapper {
  max-width: 390px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
</style>
