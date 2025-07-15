<template>
  <footer class="footer">
    <nav class="tab-bar">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.to"
        class="tab-item"
        active-class="active"
      >
        <template v-if="tab.icon">
          <img :src="tab.icon" :alt="tab.label" class="tab-icon" />
        </template>
        <template v-else>
          <div class="icon-placeholder" />
        </template>

        <span class="tab-label">{{ tab.label }}</span>
      </RouterLink>
    </nav>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const tabs = [
  { name: 'home', label: '홈', icon: null, to: '/' },
  { name: 'map', label: '지도', icon: null, to: '/map' },
  { name: 'analysis', label: '분석', icon: null, to: '/analysis' },
  { name: 'my', label: 'MY', icon: null, to: '/my' },
];
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 390px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-white);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  border-top: 1px solid var(--color-light);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  text-decoration: none;
  font-size: 0.75rem;
  font-family: 'GmarketSansMedium', sans-serif;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.icon-placeholder {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  background-color: var(--color-light, #e0e0e0);
  border-radius: 4px;
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-item.active .tab-icon {
  filter: brightness(0) saturate(100%) invert(18%) sepia(83%) saturate(5182%)
    hue-rotate(224deg) brightness(94%) contrast(101%);
}

.tab-item.active .icon-placeholder {
  background-color: var(--color-primary);
}
</style>
