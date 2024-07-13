import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: './config/config.env' });

const { MONGO_URI } = process.env;

const connectToDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI);		
		console.log(`connected to mongo database`);
	}catch (error) {
		console.log(`connect to database error => ${error}`);
	}

}

await connectToDB();
