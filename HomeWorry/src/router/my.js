export default [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/mypage/MyPage.vue'),
    meta: { 
      hideHeader: true,
      requiresAuth: true
     }
  },
  {
    path: '/my/privacy',
    name: 'my-privacy',
    component: () => import('../pages/mypage/PrivacyNotice.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/my/agency/bookmark',
    name: 'my-agency-bookmark',
    component: () => import('../pages/mypage/AgencyBookmark.vue'),
    meta: { 
      hideHeader: true,
      requiresAuth: true
     }
  },
  {
    path: '/my/listing/bookmark',
    name: 'my-map-bookmark',
    component: () => import('../pages/mypage/ListingBookmark.vue'),
    meta: { 
      hideHeader: true,
      requiresAuth: true
     }
  },
];
