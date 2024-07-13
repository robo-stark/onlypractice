import bcrypt from 'bcryptjs';

const hashData = async (data, saltRounds = 10) => {
	try{
		const hashedData = await bcrypt.hash(data, saltRounds);
		return hashedData;
	}catch(err) {
		throw err;
	}
};


const verifyHashData = async(unhashed, hashed) => {
	try {
		
		const match = await bcrypt.compare(unhashed, hashed);
		return match;
	}catch(err) {
		throw err;
	}
}


export { hashData, verifyHashData };