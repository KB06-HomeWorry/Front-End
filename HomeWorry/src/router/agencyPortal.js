// src/router/portal.js
export default [
    {
        path: '/portal',
        name:'portalHome',
        component: () => import('../pages/agencyPortal/portalHome.vue'),
        meta: {
        hideHeader: true,    // Header 숨김
        hideFooter: true     // Footer 숨김
        },
    },
    {
        path: '/portaltest',
        name:'portalTest',
        component: () => import('../pages/agencyPortal/portalTest.vue'),
        meta: {
        hideHeader: true,    // Header 숨김
        hideFooter: true     // Footer 숨김
        },
    },

//   // 사무소 정보 관리
//   {
//     path: '/portal/agency/info',
//     name: 'portalAgencyInfo',
//     component: () => import('../pages/portal/agency/AgencyInfoManage.vue'),
//     meta: { requiresAuth: true, hideHeader: true },
//   },

//   // 매물 관리 (등록/수정)
//   {
//     path: '/portal/agency/listings',
//     name: 'portalAgencyListings',
//     component: () => import('../pages/portal/agency/AgencyListingManage.vue'),
//     meta: { requiresAuth: true, hideHeader: true },
//   },

//   // 소개글 수정
//   {
//     path: '/portal/agency/profile',
//     name: 'portalAgencyProfile',
//     component: () => import('../pages/portal/agency/AgencyProfileEdit.vue'),
//     meta: { requiresAuth: true, hideHeader: true },
//   },

//   // 문의하기
//   {
//     path: '/portal/agency/inquiry',
//     name: 'portalAgencyInquiry',
//     component: () => import('../pages/portal/agency/AgencyInquiry.vue'),
//     meta: { requiresAuth: true, hideHeader: true },
//   },

//   // (선택) 중개사 로그인/가입/비번찾기
//   {
//     path: '/portal/agency/login',
//     name: 'portalAgencyLogin',
//     component: () => import('../pages/portal/agency/Login.vue'),
//     meta: { hideHeader: true },
//   },
//   {
//     path: '/portal/agency/signup',
//     name: 'portalAgencySignup',
//     component: () => import('../pages/portal/agency/Signup.vue'),
//     meta: { hideHeader: true },
//   },
//   {
//     path: '/portal/agency/forgot',
//     name: 'portalAgencyForgot',
//     component: () => import('../pages/portal/agency/ForgotPassword.vue'),
//     meta: { hideHeader: true },
//   },
];
