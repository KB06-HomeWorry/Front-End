export default [
  {
    path: '/map',
    name: 'map',
    component: () => import('../pages/map/MapPage.vue'),
  },
  {
    path: '/map/agency',
    name: 'map-agency',
    component: () => import('../pages/map/MapAgencyPage.vue'),
  },
  {
    path: '/map/compotest',
    name: 'mapcompotest',
    component: () => import('../pages/map/MapCompoTest.vue'),
  },
  {
    path: '/map/detail',
    name: 'mapdetail',
    component:()=> import('../pages/map/DetailPage.vue'),
  }
];
