import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({

	name : {type : String},
	createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    },
    checkInData : {
        image: { type: String, default: '' },
        time: { type: Date, default: null },
        location : {
            latitude : { type : Number, default : 0.0 },
            longitude : { type : Number, default : 0.0 }
        }
    },
    checkOutData : {
        image: { type: String, default: '' },
        time: { type: Date, default: null },
        location : {
            latitude : { type : Number, default : 0.0 },
            longitude : { type : Number, default : 0.0 }
        }
    },
    hasCheckedIn : {
         type : Boolean,
         default : false
    },
    hasCheckedOut : {
        type : Boolean,
        default : false
   }
	
});

const ExpenseSchema = new Schema({

	name : {type : String},
	createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    },
    expenseList : [{
        cost : { type : Number },
        description : { type: String }
    }],
  
	
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);

export { Attendance, Expense };
