import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { storeController, storeValidation } from '../../modules/store';

const router: Router = express.Router();

router
    .route('/')
    .post(auth('manageSellers'), validate(storeValidation.createStore), storeController.createStore)
    .get(auth('getStores'), validate(storeValidation.getStores), storeController.getStores);

router
    .route('/:storeId')
    .get(auth('getStores'), validate(storeValidation.getStore), storeController.getStore)
    .patch(auth('manageSellers'), validate(storeValidation.updateStore), storeController.updateStore)
    .delete(auth('manageSellers'), validate(storeValidation.deleteStore), storeController.deleteStore);

router.post(
    '/become-seller',
    auth('user'),
    validate(storeValidation.becomeSellerAndCreateStore),
    storeController.becomeSellerAndCreateStore
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management and retrieval
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a store
 *     description: Only admins can create stores for sellers.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - ownerId
 *               - address
 *               - logoUrl
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               address:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *             example:
 *               name: My Store
 *               description: This is my awesome store
 *               ownerId: 60d725b9e95a2a45c8bc6a1a
 *               address: 123 Main St, City, Country
 *               logoUrl: http://example.com/logo.jpg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Store'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all stores
 *     description: Retrieve all stores.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Store name
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *         description: Store owner id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of stores
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Store'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get a store
 *     description: Retrieve store information.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Store'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a store
 *     description: Only admins can update store information.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *             example:
 *               name: Updated Store Name
 *               description: Updated store description
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Store'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a store
 *     description: Only admins can delete stores.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /stores/become-seller:
 *   post:
 *     summary: Become a seller and create a store
 *     description: Regular users can use this endpoint to become sellers and create their first store.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - address
 *               - logoUrl
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *             example:
 *               name: My New Store
 *               description: This is my first store as a seller
 *               address: 456 Seller St, City, Country
 *               logoUrl: http://example.com/mylogo.jpg
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
 *                 store:
 *                   $ref: '#/components/schemas/Store'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */