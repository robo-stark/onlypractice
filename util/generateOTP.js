const generateOTP = async () => {
	try {
		return `${Math.floor(10000 + Math.random() * 90000)}`;
	}catch(err) {
		throw err;
	}
}

export default generateOTP;