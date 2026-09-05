export const ROUTES = {
  home: '/',
  designSystem: '/design-system',
  dashboardFoundation: '/design-system/dashboard-foundation',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  superAdmin: {
    dashboard: '/super-admin/dashboard',
    schools: '/super-admin/schools',
    newSchool: '/super-admin/schools/new',
    subscriptions: '/super-admin/subscriptions',
    subscriptionUsage: '/super-admin/subscriptions/usage',
    billing: '/super-admin/billing',
    users: '/super-admin/users',
  },
  schoolAdmin: {
    dashboard: '/school-admin/dashboard',
  },
} as const;
