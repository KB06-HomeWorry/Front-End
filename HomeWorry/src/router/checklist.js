export default [
  {
    path: '/checklist-stage',
    name: 'ChecklistStage',
    component: () =>
      import('../pages/checklist/components/ChecklistStagePage.vue'),
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: () => import('../pages/checklist/ChecklistPage.vue'),
  },
];
