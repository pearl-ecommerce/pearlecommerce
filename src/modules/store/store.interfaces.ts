import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IStore {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  address: string;
  logoUrl: string;
}

export interface IStoreDoc extends IStore, Document { }

export interface IStoreModel extends Model<IStoreDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateStoreBody = Partial<IStore>;

export type NewStore = IStore;