export default [
  {
    path: '/map',
    name: 'map',
    component: () => import('../pages/map/MapPage.vue'),
  },
  {
    path: '/map/compotest',
    name: 'mapcompotest',
    component: () => import('../pages/map/MapCompoTest.vue'),
  },
];
