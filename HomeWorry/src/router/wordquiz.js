export default [
  {
    path: "/quiz",
    name: "quiz",
    component: () => import("../pages/wordquiz/QuizHomePage.vue"),
    meta: { hideHeader: true },
  },
  {
    path: "/quiz/ox",
    name: "oxquiz",
    component: () => import("../pages/wordquiz/OXQuizPage.vue"),
  },
  {
    path: "/quiz/select",
    name: "selectquiz",
    component: () => import("../pages/wordquiz/SelectQuizPage.vue"),
  },
  // {
  //   path: '/quiztest',
  //   name: 'quiztest',
  //   component: () => import('../pages/wordquiz/QuizTest.vue'),
  // },
];
