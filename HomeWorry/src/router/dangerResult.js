export default [
  {
    path: "/dangerResult",
    name: "dangerResult",
    component: () => import("../pages/dangerResult/DangerResultPage.vue"),
    meta: { hideHeader: true }
  },
];
