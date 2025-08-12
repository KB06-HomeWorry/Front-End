export default [
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../pages/wordquiz/QuizHomePage.vue'),
    meta: { hideHeader: true}
  },
  {
    path: '/quiz/:number',
    name: 'oxquiz',
    component: () => import('../pages/wordquiz/QuizPage.vue'),
    meta: { hideHeader: true}
  }
];
