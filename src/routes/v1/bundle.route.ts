import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { bundleController, bundleValidation } from '../../modules/bundle';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageBundle'), validate(bundleValidation.createBundle), bundleController.createBundle);

router.get('/getBundles', validate(bundleValidation.getBundles), bundleController.getBundles);

router.get('/allgetBundles', validate(bundleValidation.getBundles), bundleController.allgetBundles);

router
  .route('/:bundleId')
  .delete(auth('manageBundle'), validate(bundleValidation.deleteBundle), bundleController.clearBundle);

router.post('/removebundle', validate(bundleValidation.removeBundle), bundleController.removeItemFromBundle);

export default router;
