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
    meta: {
      hideHeader: true,    // Header 숨김
    },
  },
  {
    path: '/ai/contract-ocr',
    name: 'aiContractOcr',
    component: () => import('../pages/ai/components/ContractOcrUploader.vue'),
  },
  {
    path: '/ai/recommendation',
    name: 'recommendation',
    component: () => import('../pages/ai/Recommendation.vue'),
  },
];
