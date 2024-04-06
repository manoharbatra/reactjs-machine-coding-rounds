import { lazy } from 'react';

export const PublicRoutes = [
  {
    slug: '/',
    component: lazy(() => import('../pages/currencyConverter')),
    exact: true,
  }
]