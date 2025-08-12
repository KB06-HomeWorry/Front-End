export default [
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: { hideHeader: true }
  },
];
