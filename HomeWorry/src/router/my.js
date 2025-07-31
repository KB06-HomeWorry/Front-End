export default [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/mypage/MyPage.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/my/privacy',
    name: 'my-privacy',
    component: () => import('../pages/mypage/PrivacyNotice.vue'),
  },
  {
    path: '/my/agency/bookmark',
    name: 'my-agency-bookmark',
    component: () => import('../pages/mypage/AgencyBookmark.vue'),
    meta: { hideHeader: true }
  },
];
