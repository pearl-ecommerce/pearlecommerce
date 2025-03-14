// import httpStatus from 'http-status';
// import mongoose from 'mongoose';
// import Role from './logistics.model';
// import ApiError from '../errors/ApiError';
// import { IOptions, QueryResult } from '../paginate/paginate';
// import { IRoleDoc, NewRole, UpdateRoleBody } from './logistics.interfaces';
// import Order from '../order/order.model';

import axios from "axios";
// import { Order } from '../order/order.model';
const TERMINAL_AFRICA_API_KEY = "YOUR_TERMINAL_AFRICA_API_KEY";
const TERMINAL_AFRICA_URL = "https://api.terminal.africa/v1/shipping/rates";

export const getShippingCost = async (origin: any, destination: any, parcel: any): Promise<any> => {
  const response = await axios.post(
    TERMINAL_AFRICA_URL,
    { origin, destination, parcel },
    {
      headers: {
        Authorization: `Bearer ${TERMINAL_AFRICA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data; // Return only the relevant data
};

//const updateOrderStatus = async (data: any) => {
//   const { tracking_id, current_status, status_history } = data;

//   const order = await Order.findOne({ trackingId: tracking_id });

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   order.logisticsStatus = current_status;
//   order.logisticsDetails.statusHistory = status_history;
//   await order.save();
// };

// export const logisticsService = {
//   updateOrderStatus,
// };

// export const processLogisticsUpdate = async (update: any) => {
//     const { tracking_id, status } = update;
//     await updateOrderStatus(tracking_id, status);
//     await notifyUser(tracking_id, status);
// };

// // 2️⃣ Get Shipment Status (Manual Tracking)
// export const getShipmentStatus = async (trackingId: string) => {
//   const response =""
//     // await axios.get(`${LOGISTICS_API_URL}/v1/shipping/track/${trackingId}`, {
//     //     headers: { Authorization: `Bearer ${LOGISTICS_API_KEY}` },
//     // });
//     return response;
// };

// // 3️⃣ Cancel Shipment
// export const cancelShipment = async (shipmentId: string) => {
//     // const response = await axios.post(`${LOGISTICS_API_URL}/v1/shipping/cancel`, { shipmentId }, {
//     //     headers: { Authorization: `Bearer ${LOGISTICS_API_KEY}` },
//     });
//     return response.data;
// };
