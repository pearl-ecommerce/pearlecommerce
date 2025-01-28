import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { roleController, roleValidation } from '../../modules/role';  // Adjusted to 'role'

const router: Router = express.Router();

router
    .route('/')
    .post(auth('manageRole'), validate(roleValidation.createRole), roleController.createRole);  // Changed 'discount' to 'role'

router.get('/getRole', validate(roleValidation.getRole), roleController.getRole);  // Changed 'discount' to 'role'

router
    .route('/:roleId')
    .get(validate(roleValidation.getRole), roleController.getRole)  // Changed 'discount' to 'role'
    .patch(auth('manageRole'), validate(roleValidation.updateRole), roleController.updateRole)  // Changed 'discount' to 'role'
    .delete(auth('manageRole'), validate(roleValidation.deleteRole), roleController.deleteRole);  // Changed 'discount' to 'role'


export default router;
