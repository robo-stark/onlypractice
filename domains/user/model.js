import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({

	name : {type : String},
    email : { 
        type : String,
        required: true,
        unique: true
     },
	password : { type : String },
	token : { type : String },
	createdAt: {
        type: Date,
        default: Date.now
    }
	
});

export default mongoose.model("User", UserSchema);