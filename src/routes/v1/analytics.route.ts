import express, { Router } from 'express';
// import { validate } from '../../modules/validate';
import {  auth } from '../../modules/auth';
// import { productController } from '../../modules/product';
// import { orderController} from '../../modules/order';
import { userController} from '../../modules/user';

// import { userController, userValidation } from '../../modules/user';

const router: Router = express.Router();

router.post('/fetchAnalyticsData', auth(), userController.fetchAnalyticsData);

router.post('/userfetchAnalyticsData', auth(), userController.userfetchAnalyticsData);

router.post('/userfetchInsights', auth(), userController.userfetchInsights);


export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

