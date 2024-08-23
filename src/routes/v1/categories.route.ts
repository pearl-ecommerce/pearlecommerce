import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { categoryController, categoryValidation } from '../../modules/category';

const router: Router = express.Router();

// router
//     .route('/')
//     .post(auth('manageCategories'), validate(categoryValidation.createCategory), categoryController.createCategories)
//     .get(auth('getCategories'), validate(categoryValidation.getCategory), categoryController.getCategories);
    router
  .route('/')
  .post(categoryController.createCategories) // Removed auth middleware
  .get(validate(categoryValidation.getCategory), categoryController.getCategories); // Removed auth middleware
  

router
    .route('/:categoryId')
   // .get(auth('getProducts'), validate(productValidation.getProduct), productController.getProduct)
    .patch(auth('manageCategories'), validate(categoryValidation.updateCategory), categoryController.updateCategories)
    .delete(auth('manageCategories'), validate(categoryValidation.deleteCategory), categoryController.deleteCategories);
    

export default router;

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Create Categories
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: create Categories
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               
 *             properties:
 *               name:
 *                 type: string
 *           
 *             example:
 *               name: fake name
 
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */


