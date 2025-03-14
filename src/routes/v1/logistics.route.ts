import express, { Router } from "express";
// import { validate } from "../../modules/validate";
// //import { auth } from "../../modules/auth";
// import { logisticsController, logisticsValidation } from "../../modules/logistics";

const router: Router = express.Router();

// router.post("/shipping-cost", validate(logisticsValidation.getShippingCost), logisticsController.fetchShippingCost);


// router.post('/webhook/logistics', logisticsController.handleLogisticsWebhook);

export default router;
