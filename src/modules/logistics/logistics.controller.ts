// import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
// import ApiError from '../errors/ApiError';
// import pick from '../utils/pick';
// import { logisticsService } from './logistics.service';
import { getShippingCost } from "./logistics.service";


export const fetchShippingCost = catchAsync(async (req: Request, res: Response) => {
  const { origin, destination, parcel } = req.body;

  if (!origin || !destination || !parcel) {
    // return res.status(400).json({ error: "Missing required fields" });
  }

  const shippingData = await getShippingCost(origin, destination, parcel);

  res.status(200).json({
    shipping_cost: shippingData.amount,
    estimated_delivery_time: shippingData.estimated_delivery_time,
    provider: shippingData.provider,
  });
});

// const handleLogisticsWebhook = catchAsync(async (req: Request, res: Response) => {
//   const { event, data } = req.body;

//   if (event === "shipment_status_updated") {
//     // await logisticsService.updateOrderStatus(data);
//     // return res.status(httpStatus.OK).json({ message: "Order status updated successfully" });
//   }

//   res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid event type" });
// });

// export const logisticsController = {
//   handleLogisticsWebhook,
// };

// 1️⃣ Webhook for Real-time Shipment Updates
// export const logisticsWebhook = catchAsync(async (req: Request, res: Response) => {
//     const update = req.body;
//     await logisticsService.processLogisticsUpdate(update);
//     res.status(httpStatus.OK).json({ message: 'Webhook received' });
// });

// // 2️⃣ Track Shipment Manually
// export const trackShipment = catchAsync(async (req: Request, res: Response) => {
//     const { trackingId } = req.params;
//     const shipmentStatus = await logisticsService.getShipmentStatus(trackingId);
//     res.status(httpStatus.OK).json(shipmentStatus);
// });

// // 3️⃣ Cancel a Shipment
// export const cancelShipment = catchAsync(async (req: Request, res: Response) => {
//     const { shipmentId } = req.body;
//     const cancellationResponse = await logisticsService.cancelShipment(shipmentId);
//     res.status(httpStatus.OK).json(cancellationResponse);
// });

