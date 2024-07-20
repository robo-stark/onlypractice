import nodemailer from 'nodemailer';

const  { AUTH_EMAIL, AUTH_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    //host: "smtp.sendgrid.net",
    //host: "smtp-relay.sendinblue.com",
    port : 587,
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASS
    }

});



transporter.verify((error, success) => {

    if (error) {
        console.log(error);
    } else {
        console.log("Mail Service Running");
    }

});

const sendEmail = async (mailOptions) => {
	try{
		return await transporter.sendMail(mailOptions);
	}catch(err){
		throw err;
	}
}

export { sendEmail };

