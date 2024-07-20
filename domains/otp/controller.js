import OTP from './model.js'
import User from '../user/model.js'; 
import generateOTP from '../../util/generateOTP.js';
import { sendEmail } from '../../util/nodemail.js';
import { hashData, verifyHashData } from './../../util/hashData.js';
const { AUTH_EMAIL } = process.env;

const EMAIL_SENDER_NAME = "Only Practice";


const forgotPasswordOTP = async (data) => {

	let { email } = data;
	const duration = 1;

	try{

		if (!(email)) {
			throw { message: "Email provided is empty!!", code: 400 };
	   	}

		const fetchedUser = await User.findOne({ email : email });
		if (fetchedUser) {
			throw { message: `user with email ${email} doesn't exists`, code: 404 };
		}

		await OTP.deleteOne({email});

		const generatedOTP = await generateOTP();

		const mailOptions = {
			from : AUTH_EMAIL,
			to : email,
			subject : "Otp to reset password",
			html : `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
					<div style="margin:50px auto;width:70%;padding:20px 0">
						<div style="border-bottom:1px solid #eee">
						<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${EMAIL_SENDER_NAME}</a>
						</div>
						<p style="font-size:1.1em">Hi,</p>
						<p>Use the following OTP to reset your password. OTP is valid for 5 minutes</p>
						<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${generatedOTP}</h2>
						<p style="font-size:0.9em;">Regards,<br />Your Brand</p>
						<hr style="border:none;border-top:1px solid #eee" />
						<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
						<p>${EMAIL_SENDER_NAME}</p>
						</div>
					</div>
					</div>`
		}

		await sendEmail(mailOptions);

		const hashedOTP = await hashData(generatedOTP);
		const newOTP = new OTP({
			email,
			otp : hashedOTP,
			createdAt : Date.now(),
			expiresAt : Date.now() + 360000 * +duration
		});

		await newOTP.save();

		return {
			"status": "success",
			"data" : null,
			"message": "Otp Sent Successfully"
		};
	
	}catch(err){
		console.log(`error sending forgot password : ${email}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };
	}
};



const deleteOTP = async(email) => {
	try{
		await OTP.deleteOne({email});
	}catch(err){
		console.log(`error while deleting otp for user with email : ${email}\n${err.message}`);
		throw { message: err.message, code: err.code || 500 };
	}
};


const verifyOTP = async({ email, otp }) => {
	try{
		
		if (!(email)) {
			throw { message: "Email provided is empty!!", code: 400 };
	   	}

		if (!(otp)) {
			throw { message: "Otp provided is empty!!", code: 400 };
	   	}

		const matchedOTPRecord = await OTP.findOne({email});

		if (!matchedOTPRecord){
			throw { message: `No otp record found for email ${email}`, code: 404 };
		} 

		const { expiresAt } = matchedOTPRecord;
		if (expiresAt < Date.now()){
			await OTP.deleteOne({email});
			throw { message: `Otp has expired request for a new one`, code: 404 };
		}

		const hashedOTP = matchedOTPRecord.otp;
		const validOTP = await verifyHashData(otp, hashedOTP);
		if (validOTP) {
			return {
			  "status": "success",
			  "data": null,
			  "message": "Otp verified successfully"
			}
		}else{ 
			throw { message: "Otp cannot be verified", code: 401 };
		}

	}catch(err) {
		console.log(`error while deleting otp for user with email : ${email}\n${err.message}`);
		throw err;
	}
};



export { verifyOTP, deleteOTP, forgotPasswordOTP };