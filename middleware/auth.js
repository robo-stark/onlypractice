import jwt from 'jsonwebtoken';

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(401).send({
			"status": "failed",
			"message": "Invalid Session. Please Re-Login"
	  });
		
	}

	try {
		const decodedToken = jwt.verify(token, TOKEN_KEY);
		req.currentUser = decodedToken;
	} catch(err) {
		return res.status(401).send({
			"status": "failed",
			"message": "Inavlid Token provided. Please Re-Login"
	  });
	}

	

	return next();

};

export default verifyToken;