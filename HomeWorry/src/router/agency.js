export default [
  // {
  //   path: '/agency',
  //   name: 'agencyDetail',
  //   component: () => import('../pages/agency/AgencyDetail.vue'),
  // },
  {
    path: '/agency/:agencyId',
    name: 'agencyDetail',
    component: () => import('../pages/agency/AgencyDetail.vue'),
  },
  {
    path: '/agency/review-write',
    name: 'agencyReviewWrite',
    component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  },
  // {
  //   path: '/agency/:agencyId/review-write',
  //   name: 'agencyReviewWrite',
  //   component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  // },
];
