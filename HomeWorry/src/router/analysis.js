export default [
  {
    path: "/analysis",
    name: "analysis",
    component: () => import("../pages/analysis/AnalysisPage.vue"),
  },
  {
    path: "/ai/analysis",
    name: "aiAnalysis",
    component: () => import("../pages/aiAnalysis/aiDocumentSubmitPage.vue"),
  },
];
