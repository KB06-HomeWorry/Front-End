import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/home/HomePage2.vue";
import authRoutes from "./auth";
import mapRoutes from "./map";
import analysisRoutes from "./analysis";
import myRoutes from "./my";
import checklistRoutes from "./checklist";
import agencyRoutes from "./agency";
import notfoundRoutes from "./notfound";
import dangerResults from "./dangerResult";
import wordquizRoutes from "./wordquiz";
import Calculator from "../pages/home/Calculator.vue";
import ai from './ai';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: Calculator,
          meta: {
      hideHeader: true,    // Header 숨김
    },
    },
    ...authRoutes,
    ...mapRoutes,
    ...analysisRoutes,
    ...checklistRoutes,
    ...dangerResults,
    ...myRoutes,
    ...agencyRoutes,
    ...notfoundRoutes,
    ...wordquizRoutes,
    ...ai,
  ],
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('user-token')
  if (token){
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = payload.exp * 1000 < Date.now()      

    if (to.meta.requiresAuth && isExpired){
      alert('로그인이 필요한 서비스입니다.')
      next({
        path: '/auth/login',
        query: {redirect: to.path}
      })
    } else {
      next();
    }
  } else {
    if (to.meta.requiresAuth){
      alert('로그인이 필요한 서비스입니다.')
      next({
        path: '/auth/login',
        query: {redirect: to.path}
      })
    } else {
      next();
    }
  }
})

export default router;
