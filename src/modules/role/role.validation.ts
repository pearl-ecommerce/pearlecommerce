import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewRole } from './role.interfaces';

// Define the validation schema for creating a role record
const createRoleBody: Record<keyof NewRole, any> = {
  role: Joi.string().required(),
  name: Joi.string(),
};

// Validation for creating a new role record
export const createRole = {
  body: Joi.object().keys(createRoleBody),
};

// Validation for retrieving multiple role records with query filters
export const getRoles = {
  query: Joi.object().keys({
    role: Joi.string(),
    name: Joi.string(),
  }),
};

// Validation for retrieving a single role record by ID
export const getRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId), 
  }),
};

// Validation for updating a role record by ID
export const updateRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId).required(), 
  }),
  body: Joi.object()
    .keys({
      role: Joi.string(),
    })
    .min(1), // Ensure at least one field is updated
};

// Validation for deleting a role record by ID
export const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId).required(), 
  }),
};
