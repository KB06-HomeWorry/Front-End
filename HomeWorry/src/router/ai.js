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
    path: '/ai/contract-ocr',
    name: 'aiContractOcr',
    component: () => import('../pages/ai/components/ContractOcrUploader.vue'),
  },
];
