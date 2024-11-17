import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { pricingController, pricingValidation } from '../../modules/pricing';

const router: Router = express.Router();

router
    .route('/')
    .post(auth('managePricing'), validate(pricingValidation.createPricing), pricingController.createPricing);

router.get('/getPricing', validate(pricingValidation.getPricing), pricingController.getPricing);

router
    .route('/:pricingId')
    .get(validate(pricingValidation.getPricing), pricingController.getPricing)
    .patch(auth('managePricing'), validate(pricingValidation.updatePricing), pricingController.updatePricing)
    .delete(auth('managePricing'), validate(pricingValidation.deletePricing), pricingController.deletePricing);

export default router;
