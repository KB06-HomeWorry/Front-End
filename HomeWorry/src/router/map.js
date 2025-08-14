export default [
  {
    path: '/map',
    name: 'map',
    component: () => import('../pages/map/MapPage.vue'),
    meta: { 
      keepAlive: true,
      hideHeader: true
    },
  },
  {
    path: '/map/apartment',
    name: 'map-apartment',
    component: () => import('../pages/map/FilterMapPage.vue'),
    meta: { hideHeader: true },
  },
  {
    path: '/map/onetwo',
    name: 'map-onetwo',
    component: () => import('../pages/map/FilterMapPage.vue'),
    meta: { hideHeader: true },
  },
  {
    path: '/map/building',
    name: 'map-building',
    component: () => import('../pages/map/FilterMapPage.vue'),
    meta: { hideHeader: true },
  },
  {
    path: '/map/officetel',
    name: 'map-officetel',
    component: () => import('../pages/map/FilterMapPage.vue'),
    meta: { hideHeader: true },
  },
  {
  path: '/listing/:listingId',
  name: 'listingDetail',
  component: () => import('@/pages/map/ListingDetailPage.vue'),
  meta: { hideHeader: true }
},
{
  path: '/pricetrend/:priceTrendId',
  name: 'PriceDetail',
  component: () => import('@/pages/map/PriceDetailPage.vue'),
  meta: { hideHeader: true }
},
];
