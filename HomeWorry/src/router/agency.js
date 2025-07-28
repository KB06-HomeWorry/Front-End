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
  },
  // {
  //   path: '/agency/review-write',
  //   name: 'agencyReviewWrite',
  //   component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  // },
  {
    path: '/agency/:agencyId/review-write',
    name: 'agencyReviewWrite',
    component: () => import('../pages/agency/AgencyReviewWrite.vue'),
  },
];
