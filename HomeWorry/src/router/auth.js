export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
  },
  {
    path: '/auth/signup-agreement',
    name: 'signup-agreement',
    component: () => import('../pages/auth/SignupAgreementPage.vue'),
    meta: {
      hideHeader: true,    // Header 숨김
      hideFooter: true     // Footer 숨김
    },
  },
  {
    path: '/auth/signup-form',
    name: 'signup-form',
    component: () => import('../pages/auth/SignupFormPage.vue'),
    meta: {
      hideHeader: true,    // Header 숨김
      hideFooter: true     // Footer 숨김
    },
  },

  // {
  //   path: '/auth/find-password',
  //   name: 'find-password',
  //   component: () => import('../pages/auth/FindPasswordPage.vue'),
  // },

  ];