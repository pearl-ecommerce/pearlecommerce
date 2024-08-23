import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import productRoute from './product.route';
import storeRoute from './store.route';
import categoriesRoute from './categories.route';
import paymentRoute from './payment.route';
import orderRoute from './order.route';

import config from '../../config/config';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/stores',
    route: storeRoute,
  },
  {
    path: '/categories',
    route: categoriesRoute,
  },
    {
    path: '/payment',
    route: paymentRoute,
  },
     {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },


];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
