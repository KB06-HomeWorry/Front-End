export default [
  {
    path: '/ai/estate-ease',
    name: 'estate-ease',
    component: () => import('../pages/ai/EstateEase.vue'),
  },
  {
    path: '/ai/analysis',
    name: 'aiAnalysis',
    component: () => import('../pages/ai/AIDocumentSubmitPage.vue'),
  },
  {
    path: '/ai/compotest',
    name: 'aicompotest',
    component: () => import('../pages/ai/AICompoTest.vue'),
  },
];
