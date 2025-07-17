<template>
  <footer class="footer">
    <nav class="tab-bar">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.to"
        class="tab-item bodyLight12px"
        active-class="active"
      >
        <img
          :src="route.path === tab.to ? tab.iconDark : tab.iconLight"
          :alt="tab.label"
          class="tab-icon"
        />
        <span class="tab-label">{{ tab.label }}</span>
      </RouterLink>

    </nav>
  </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import homeLight from '@/assets/icons/nav_home_light.png';
import homeDark from '@/assets/icons/nav_home_dark.png';
import mapLight from '@/assets/icons/nav_map_light.png';
import mapDark from '@/assets/icons/nav_map_dark.png';
import analysisLight from '@/assets/icons/nav_analysis_light.png';
import analysisDark from '@/assets/icons/nav_analysis_dark.png';
import myLight from '@/assets/icons/nav_my_light.png';
import myDark from '@/assets/icons/nav_my_dark.png';

const route = useRoute();

const tabs = [
  {
    name: 'home',
    label: '홈',
    iconLight: homeLight,
    iconDark: homeDark,
    to: '/',
  },
  {
    name: 'map',
    label: '지도',
    iconLight: mapLight,
    iconDark: mapDark,
    to: '/map',
  },
  {
    name: 'analysis',
    label: '분석',
    iconLight: analysisLight,
    iconDark: analysisDark,
    to: '/analysis',
  },
  {
    name: 'my',
    label: '마이페이지',
    iconLight: myLight,
    iconDark: myDark,
    to: '/my',
  },
];
</script>


<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 393px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-white);
  z-index: 10;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  border-top: 1px solid var(--color-light);
}

.tab-item {
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-mediumgray);
  text-decoration: none;
}

.tab-icon {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.tab-item.active {
  color: var(--color-primary);
}

</style>
