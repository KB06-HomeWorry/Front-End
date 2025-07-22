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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
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
});

export default router;
