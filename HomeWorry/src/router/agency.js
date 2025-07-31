export default [
  {
    path: '/agencysample/1',
    name: 'agencySample',
    component: () => import('../pages/agency/AgencySample.vue'),
  },
  {
    path: '/agency/:agencyId',
    name: 'agencyDetail',
    component: () => import('../pages/agency/AgencyDetail.vue'),
      meta: { hideHeader: true }
  },
  {
    path: '/agency/review-write',
    name: 'agencyReviewWrite',
    component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  },
  {
    path: '/agency/list',
    name: 'agencyList',
    component: () => import('../pages/agency/AgencyListPage.vue'),
  },
  {
    path: '/agency/:agencyId/review-write',
    name: 'agencyReviewWrite',
    component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  },
];
