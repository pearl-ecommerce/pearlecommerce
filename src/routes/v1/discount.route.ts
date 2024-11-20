import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { discountController, discountValidation } from '../../modules/discount';

const router: Router = express.Router();

router
    .route('/')
    .post(auth('manageDiscount'), validate(discountValidation.createDiscount), discountController.createDiscount);

router.get('/getDiscount', validate(discountValidation.getDiscount), discountController.getDiscount);

router
    .route('/:discountId')
    .get(validate(discountValidation.getDiscount), discountController.getDiscount)
    .patch(auth('manageDiscount'), validate(discountValidation.updateDiscount), discountController.updateDiscount)
    .delete(auth('manageDiscount'), validate(discountValidation.deleteDiscount), discountController.deleteDiscount);

export default router;
