import express from "express";
const otpRoutes = express.Router();
import { changePassword } from "../user/controller.js";
import { verifyOTP, deleteOTP, forgotPasswordOTP } from './controller.js';


//1. forgot password Post -> email
otpRoutes.post("/forgot-password", async (req, res) => {

	try {
		const otpStatus = await forgotPasswordOTP(req.body);
		res.status(200).json(otpStatus);

	} catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}

})

//2. verify email Post -> email, otp
otpRoutes.post("/verify-otp", async (req, res) => {
	try {
		
		const otpStatus = await verifyOTP(req.body);
		res.status(200).json(otpStatus);
		
	}catch(err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
});

//3. Post -> email, password
otpRoutes.post("/change-password", async (req, res) => {
	try {
		
		const passwordStatus = await changePassword(req.body);
		res.status(200).json(passwordStatus);

	}catch(err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
});


export default otpRoutes;