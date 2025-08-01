export default [
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../pages/wordquiz/QuizHomePage.vue'),
  },
  {
    path: '/quiz/:number',
    name: 'oxquiz',
    component: () => import('../pages/wordquiz/QuizPage.vue'),
  }
];
