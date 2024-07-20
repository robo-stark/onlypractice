import express from 'express';
const router = express.Router();

import userRoutes from './../domains/user/routes.js';
import dataRoutes from '../domains/data/routes.js';
import otpRoutes from '../domains/otp/routes.js';

router.use("/user", userRoutes);
router.use("/data", dataRoutes);
router.use("/otp", otpRoutes);

export default router;

