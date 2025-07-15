<template>
  <header class="header">
    <div class="logo">
      <h1 class="titleBold24px">집걱정단</h1>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: var(--color-white);
  z-index: 100;
  max-width: 390px;
  width: 100%;
  margin: 0 auto;
}
</style>
