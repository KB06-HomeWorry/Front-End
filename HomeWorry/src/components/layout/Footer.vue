<template>
  <footer class="footer">
    <nav class="tab-bar">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.to"
        class="tab-item bodyLight10px"
        :class="{ active: isTabActive(tab) }"
        @click="onTabClick()"
      >
        <img
          :src="isTabActive(tab) ? tab.iconDark : tab.iconLight"
          :alt="tab.label"
          class="tab-icon"
        />
        <span class="tab-label">{{ tab.label }}</span>
      </RouterLink>
    </nav>
  </footer>
</template>

<script setup>
import { useRoute } from "vue-router";
import homeLight from "@/assets/icons/nav_home_light.png";
import homeDark from "@/assets/icons/nav_home_dark.png";
import mapLight from "@/assets/icons/nav_map_light.png";
import mapDark from "@/assets/icons/nav_map_dark.png";
import agencyLight from "@/assets/icons/nav_agency_light.png";
import agencyDark from "@/assets/icons/nav_agency_dark.png";
import myLight from "@/assets/icons/nav_my_light.png";
import myDark from "@/assets/icons/nav_my_dark.png";
import { useChecklistStore } from "@/stores/checklist";

const checklistStore = useChecklistStore();
const route = useRoute();

const tabs = [
  { name: "home",   label: "홈",     iconLight: homeLight,   iconDark: homeDark,   to: "/" },
  { name: "map",    label: "지도",   iconLight: mapLight,    iconDark: mapDark,    to: "/map" },
  { name: "agency", label: "중개사", iconLight: agencyLight, iconDark: agencyDark, to: "/agency/list" },
  { name: "my",     label: "마이페이지", iconLight: myLight, iconDark: myDark,    to: "/my" },
];

// ✅ 탭 활성화 기준: /map*, /agency*, /my* 전부 활성
function isTabActive(tab) {
  const p = route.path || "/";
  switch (tab.name) {
    case "home":
      return p === "/";
    case "map":
      return p.startsWith("/map");
    case "agency":
      return p.startsWith("/agency");
    case "my":
      return p.startsWith("/my");
    default:
      return p === tab.to;
  }
}

function onTabClick() {
  // 원래 하던 로직 유지
  console.log("탭 클릭됨:", checklistStore.checklistData.stage);
  checklistStore.checklistData.stage = "계약 전";
}
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
  height: 64px;
  border-top: 1px solid var(--color-light);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-mediumgray);
  text-decoration: none;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 6px;
}

.tab-item.active {
  color: var(--color-primary);
}
</style>
