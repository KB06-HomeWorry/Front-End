import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import mapRoutes from './map';
import analysisRoutes from './analysis';
import myRoutes from './my';
import notfoundRoutes from './notfound';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    ...mapRoutes,
    ...analysisRoutes,
    ...myRoutes,
    ...notfoundRoutes,
  ],
});

export default router;
