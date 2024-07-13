import express from 'express';
const router = express.Router();

import userRoutes from './../domains/user/routes.js';
import dataRoutes from '../domains/data/routes.js';

router.use("/user", userRoutes);
router.use("/data", dataRoutes);

export default router;

