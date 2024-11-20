import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { cartController, cartValidation } from '../../modules/cart';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageCart'), cartController.createCart);

router.get('/getCarts', validate(cartValidation.getCarts), cartController.getCarts);

router
  .route('/:cartId')
//   .get(validate(cartValidation.getCart), cartController.getCart)
//   .patch(auth('manageCart'), validate(cartValidation.updateCart), cartController.updateItemQuantityplus)
  .delete(auth('manageCart'), validate(cartValidation.deleteCart), cartController.clearCart);

router.get('/removecart', validate(cartValidation.removeCart), cartController.removeItemFromCart);

export default router;
