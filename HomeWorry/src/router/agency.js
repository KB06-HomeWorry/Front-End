export default [
  {
    path: '/agency/:agencyId',
    name: 'agencyDetail',
    component: () => import('../pages/agency/AgencyDetail.vue'),
      meta: { hideHeader: true }
  },
  {
    path: '/agency/list',
    name: 'agencyList',
    component: () => import('../pages/agency/AgencyListPage.vue'),
  },
  {
    path: '/agency/:agencyId/listings',
    name: 'agencyListing',
    component: () => import('../pages/agency/ListingPage.vue'),
  },
  {
    path: '/agency/:agencyId/review-write',
    name: 'agencyReviewWrite',
    component: () => import('../pages/agency/AgencyReviewWrite.vue'),
    meta: {
      requiresAuth: true
    }
  },
    {
    path: '/agency/map',
    name: 'agencyMap',
    component: () => import('../pages/agency/AgencyMapPage.vue'),
  },
];
