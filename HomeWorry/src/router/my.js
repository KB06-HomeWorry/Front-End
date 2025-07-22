export default [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/mypage/MyPage.vue'),
  },
  {
    path: '/my/privacy',
    name: 'my-privacy',
    component: () => import('../pages/mypage/PrivacyNotice.vue'),
  },
];
