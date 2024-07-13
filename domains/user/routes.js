import express from "express";
const userRoutes = express.Router();
import { signupUser , loginUser, fetchUserData, fetchUserList , deleteUser, updateUser} from './controller.js';
import verifyToken from "../../middleware/auth.js";


userRoutes.get("/", async (req, res) => {
	res.status(statusCode).json({
		"status": "ok",
		"data": null,
		"message":"puneet chutiya"
	});
})

//post body -> email, password
userRoutes.post("/login", async (req, res) => {
	try {

		const authUser = await loginUser(req.body);
		res.status(200).json(authUser);

	} catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
});

//post body -> email, password, name
userRoutes.post("/signup", async (req, res) => {
	try {

		const newUser = await signupUser(req.body);
		res.status(200).json(newUser);

	}catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
});

//post body -> email
userRoutes.post('/forgot-password', async (req, res) => {
	try {

		//const result = await signupUser(req.body);
		//res.status(200).json(newUser);

	}catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
});

//post body -> userId, token
userRoutes.post('/', verifyToken, async(req, res) => {
	try {
		const data = await fetchUserData(req.body);
		res.status(200).json(data);

	}catch(err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}
})



userRoutes.post("/update",verifyToken, async (req, res) => {
	try {
	
		const data = await updateUser(req.body)
		res.status(200).json(data);	

	} catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}

})



userRoutes.post("/userList",verifyToken, async (req, res) => {

	try {

		const userList = await fetchUserList(req.body);
		res.status(200).json(userList);	

	} catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}

});


userRoutes.post("/delete",verifyToken, async (req, res) => {

	try {

		const data = await deleteUser(req.body)
		res.status(200).json(data);	

	} catch (err) {
		const statusCode = err.code || 500;
        res.status(statusCode).json({
            "status": "failed",
            "data": null,
            "message": err.message
        });
	}

});

export default userRoutes;