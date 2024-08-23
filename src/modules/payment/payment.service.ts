import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Payment from './payment.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IPaymentDoc, NewPayment, UpdatePaymentBody } from './payment.interfaces';

export const createPayments = async (paymentBody: NewPayment | null): Promise<IPaymentDoc> => {
  return Payment.create(paymentBody);
};

export const getPaymentById = async (id: mongoose.Types.ObjectId): Promise<IPaymentDoc | null> => Payment.findById(id);

export const getPaymentsWithDetails = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const payments = await Payment.paginate(filter, options);
  return payments;
};

export const updatePayments = async (
  paymentId: mongoose.Types.ObjectId,
  updateBody: UpdatePaymentBody
): Promise<IPaymentDoc | null> => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

export const deletePayments = async (paymentId: mongoose.Types.ObjectId): Promise<IPaymentDoc | null> => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  await payment.remove();
  return payment;
};
