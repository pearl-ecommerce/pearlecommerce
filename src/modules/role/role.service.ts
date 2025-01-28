import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Role from './role.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IRoleDoc, NewRole, UpdateRoleBody } from './role.interfaces';

export const createRole = async ( roleData: NewRole): Promise<IRoleDoc> => {
 
  return Role.create(roleData);
};

export const queryRole = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const role = await Role.paginate(filter, options);
  return role;
};

export const getRoleById = async (id: mongoose.Types.ObjectId): Promise<IRoleDoc | null> => Role.findById(id);

export const updateRoleById = async (
  roleId: mongoose.Types.ObjectId,
  updateBody: UpdateRoleBody
): Promise<IRoleDoc | null> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

export const deleteRoleById = async (roleId: mongoose.Types.ObjectId): Promise<IRoleDoc | null> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};
