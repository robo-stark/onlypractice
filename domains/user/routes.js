import express from "express";
const userRoutes = express.Router();
import { signupUser , loginUser, fetchUserData, fetchUserList , deleteUser, updateUser} from './controller.js';
import verifyToken from "../../middleware/auth.js";

//default route to keep server running
userRoutes.get("/", async (req, res) => {
	res.status(200).json({
		"status": "success",
		"data": null,
		"message":"server healthy"
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

//--------------------------Below Non working--------------------------------------

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