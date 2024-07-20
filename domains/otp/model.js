import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OTPSchema = new Schema({
	email : {
		type : String,
		required : true
	},
	otp : String,
	createdAt : Date,
	expiresAt : Date
});

export default mongoose.model("OTP", OTPSchema);