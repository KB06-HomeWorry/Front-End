import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/home/HomePage.vue";
import authRoutes from "./auth";
import mapRoutes from "./map";
import analysisRoutes from "./analysis";
import myRoutes from "./my";
import checklistRoutes from "./checklist";
import agencyRoutes from "./agency";
import notfoundRoutes from "./notfound";
import dangerResults from "./dangerResult";
import Calculator from "../pages/home/Calculator.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/calculator",
      name: "calculator",
      component: Calculator,
    },
    ...authRoutes,
    ...mapRoutes,
    ...analysisRoutes,
    ...checklistRoutes,
    ...dangerResults,
    ...myRoutes,
    ...agencyRoutes,
    ...notfoundRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 }
  },
});

export default router;
