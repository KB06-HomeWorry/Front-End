export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
      meta: {
      hideHeader: true,    // Header 숨김
      hideFooter: true     // Footer 숨김
    },
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
  {
    path: '/auth/reset-password',
    name: 'reset-password',
    component: () => import('../pages/auth/ResetPasswordPage.vue'),
    meta: {
      hideHeader: true,    // Header 숨김
      hideFooter: true     // Footer 숨김
    },
  },
    {
    path: '/auth/reset-password/sent',
    name: 'reset-password-sent',
    component: () => import('../pages/auth/ResetPasswordSentPage.vue'),
    meta: {
      hideHeader: true,    // Header 숨김
      hideFooter: true     // Footer 숨김
    },
  },

// 토큰부분!!
  {
  path: '/auth/change-password/:token',
  name: 'change-password',
  component: () => import('../pages/auth/ChangePasswordPage.vue'),
  meta: {
    hideHeader: true,    // Header 숨김
    hideFooter: true     // Footer 숨김
  },
},
  ];