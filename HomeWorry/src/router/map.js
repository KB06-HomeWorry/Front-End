export default [
  {
    path: '/map',
    name: 'map',
    component: () => import('../pages/map/MapPage.vue'),
  },
  {
    path: '/map/apartment',
    name: 'map-apartment',
    component: () => import('../pages/map/FixMapPage.vue'),
  },
  {
    path: '/map/onetwo',
    name: 'map-onetwo',
    component: () => import('../pages/map/FixMapPage.vue'),
  },
  {
    path: '/map/building',
    name: 'map-building',
    component: () => import('../pages/map/FixMapPage.vue'),
  },
  {
    path: '/map/officetel',
    name: 'map-officetel',
    component: () => import('../pages/map/FixMapPage.vue'),
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
    component: () => import('../pages/map/DetailPage.vue'),
  },
  {
  path: '/listing/:listingId',
  name: 'listingDetail',
  component: () => import('@/pages/map/DetailPage.vue'),
  meta: { hideHeader: true }
},
{
  path: '/pricetrend/:priceTrendId',
  name: 'PriceDetail',
  component: () => import('@/pages/map/PriceDetail.vue'),
  meta: { hideHeader: true }
},
];
