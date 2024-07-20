import User from './model.js'; 
import { hashData, verifyHashData } from './../../util/hashData.js';
import createToken from './../../util/createToken.js';

const ADMIN = 1;
const USER = 0;
const appVersion = "1.0"
const appVersionPlaystore = "1.0"


//1. signup user
const signupUser = async (data) => {

	let {password, email, name } = data;

	try {

		password = password.trim()
		name = name.trim()
		email = email.trim()

		if (!(password && name && email)) {
		 	throw { message: "Empty credentials supplied!", code: 400 };
		}

		const fetchedUser = await User.findOne({ email : email });
		if (fetchedUser) {
		 	throw { message: `user with email ${email} already exists`, code: 404 };
		}

		const hashedPassword = await hashData(password);
		
		const newUser = new User({
			name : name,
			email : email,
			password : hashedPassword,
			token : ""
		});

		await newUser.save();

		return {
			  "status": "success",
			  "data" : null,
			  "message": "Account Created"
			};

	}catch(err) {
		console.log(`error sign up for user with email : ${email}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };
	}
};


//2. Login User
const loginUser = async (data) => {

	let { email, password } = data;
	try {
		
		email = email.trim()
		password = password.trim()

		if (!(email && password)) {
			throw { message: "Empty credentials supplied!", code: 400 };
		}

		const fetchedUser = await User.findOne({ email });
		if (!fetchedUser) {
			throw { message: `user with email ${email} doesn't exists`, code: 404 };
		}
	
		const hashedPassword = fetchedUser.password;
		const passwordMatch = await verifyHashData(password, hashedPassword);
		if (!passwordMatch) {
			throw { message: "Invalid Password", code: 401 }; 
		}
		
		const tokenData = { id : fetchedUser._id, email};
		const token = await createToken(tokenData);
		fetchedUser.token = token;

		await fetchedUser.save();  
	
		return {
			"status": "success",
			"data" : {
				"token" : token,
				"email" : fetchedUser.email,
				"name" : fetchedUser.name
			},
			"message": "Login Success!"
		  };
	
	}catch(err) {
		console.log(`error login in user with email : ${email}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };
	
	}

};


//3. Update password
const changePassword = async ({ email, newPassword }) => {
    try {
        // Check if email and new password are provided
        if (!email) {
            throw { message: "Email provided is empty!!", code: 400 };
        }

        if (!newPassword) {
            throw { message: "New password provided is empty!!", code: 400 };
        }

		const fetchedUser = await User.findOne({ email });
		if (!fetchedUser) {
			throw { message: `user with email ${email} doesn't exists`, code: 404 };
		}
	

        if (newPassword.length < 6) {
            throw { message: "Password should be at least 6 characters long", code: 400 };
        }

        const hashedPassword = await hashData(newPassword);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        return {
            status: "success",
            data: null,
            message: "Password changed successfully"
        };

    } catch (err) {
        console.log(`Error while changing password for user with email: ${email}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };
    }
};



const fetchUserData = async(data) => {

	let { userId, token } = data;
	try {
		userId = userId.trim()
		if (!userId) {
			throw { message: "User Id cannot be empty", code: 400 };
		}

		const fetchedUser = await User.findOne({ userId });
		if (!fetchedUser) {
			throw { message: "User doesn't exist", code: 404 };
		}

		if (fetchedUser.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

		let version = appVersion

		if (fetchedUser.userId === "testUser" || fetchedUser.userId === "testAdmin") {
			version = appVersionPlaystore
		}

		return {
			"status": "success",
			"data" : {
				"userId": fetchedUser.userId,
				"name": fetchedUser.name,
				"version": version,
				"level": fetchedUser.level,
				"createdAt": fetchedUser.createdAt,
				"token": fetchedUser.token
			},
			"message": "User Data fetched!"
		  };

	} catch (err) {
		console.log(`error fetching user data for ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
  		
	}

}


const updateUser = async(data) => {

	let { adminId, userId, updates, token } = data;

	try {

		userId = userId.trim()
		adminId = adminId.trim()
		
		if (!(userId && adminId )) {
			throw { message: "Empty credentials supplied!", code: 400 };
		}
	
		const fetchedUser = await User.findOne({ userId : userId});
	
		const fetchedAdmin = await User.findOne({ userId : adminId});
	
		if (!fetchedUser) {
			throw { message: "User dosen't exists", code: 404 };
		}
		
		if (!fetchedAdmin) {
			throw { message: "Admin dosen't exists", code: 404 };
		}
	
		if (fetchedAdmin.level < ADMIN) {
			throw { message: "Permission Denied Only Admin Can Update Users", code: 404 }
		}

		if (fetchedAdmin.level < 2) {
			if (fetchedAdmin.level === fetchedUser.level) {
				throw { message: "Admin cannot modify other admin settings", code: 404 }
			}
	
		}


		if (fetchedAdmin.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}
	
		let updateValues = {
			token : ""
		};
		
		if (updates.password.isUpdate) {
			const newPassword = updates.password.newPassword;

			if (!newPassword){
				throw { message: "Password update requested but found empty", code: 404 };
			}

			if (newPassword.length < 6) {
				throw { message: "Password must be greater than 6 characters", code: 404 };
			}
		
			const hashedPassword = await hashData(newPassword);
			updateValues.password = hashedPassword;
		}

		await User.findOneAndUpdate(
			{userId : userId},
			{ $set: updateValues },
			{ new: true }
			);

		console.log(`user ${userId} updated by admin ${adminId}}`);
	
		return {
			"status": "success",
			"data" : null,
			"message": "User Details Updated"
		  };
			
	} catch (err) {
		console.log(`error while updating user ${userId} by admin ${adminId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };
	}	
	
}


const fetchUserList = async(data) => {

	let { userId, token } = data;

	try {

		userId = userId.trim()
		
		if (!(userId)) {
			throw { message: "userId cannot be empty", code: 400 };
		}

		const fetchedUser = await User.findOne({ userId });

		if (!fetchedUser) {
			throw { message: "User dosen't exists", code: 404 };
		}

		if (fetchedUser.level < ADMIN) {
			throw { message: "Only Admin Access Allowed", code: 404 };
		}

		if (fetchedUser.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

		const users = await User.find({ });

		const userList = [];
		users.forEach((user) => {

			const userData = {
				userId : user.userId,
				name : user.name,
				level : user.level,
				createdAt : user.createdAt
			};

			if (fetchedUser.level > ADMIN) {
				userList.push(userData);
			}else{
				if (user.level < fetchedUser.level) {
					if (user.userId !== "testAdmin" || user.userId !== "testUser") {
						userList.push(userData);
					}
				}
			}

		});

		console.log(`user list requested by admin ${userId}}`);

		return {
			"status": "success",
			"data" : userList,
			"message": ""
		  };
		
	}catch(err) {
		console.log(`error while fetching user list by admin ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };	
	}
}


const deleteUser = async (data) => {

	let { userId, adminId, token } = data;
	try {
	
		if (!(userId && adminId )) {
			throw Error("Empty Fields Received")
		}

		userId = userId.trim()
		adminId = adminId.trim()

		const fetchedUser = await User.findOne({ userId : userId });

		const fetchedAdmin = await User.findOne({ userId : adminId });

		if (!fetchedUser) {
			throw { message: "Remove Failed User Dosen't Exist", code: 404 };
		}
		
		if (!fetchedAdmin) {
			throw { message: "Remove Failed Admin Dosen't Exist", code: 404 };
		}

		if (fetchedAdmin.level <= fetchedUser.level) {
			throw { message: "Permission Denied", code: 404 };
		}

		if (fetchedAdmin.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

		await User.findOneAndDelete({userId : userId});

		console.log(`user ${userId} deleted by admin ${adminId}`);

		return {
			"status": "success",
			"data" : null,
			"message": "User Removed Successfully"
		};
		
	} catch (err) {
		console.log(`error while deleting user ${userId} by admin ${adminId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 };		
	}	

}


export { signupUser , loginUser, changePassword, fetchUserList ,
	deleteUser, updateUser, fetchUserData, 
};




// 400 Bad Request: This code is used when the request that was sent to the server has invalid syntax.
// 401 Unauthorized: This is typically used when authentication is required and has failed or has not been provided.
// 404 Not Found: You use this code when a requested resource is not found but may be available in the future.
// 500 Internal Server Error: This is a generic error message, given when no more specific message is suitable.
