import { Attendance, Expense} from '../data/model.js';
import User from '../user/model.js'
import ExcelJS from 'exceljs';
import { sendEmail } from '../../util/nodemail.js';

const  { AUTH_EMAIL} = process.env;


const ADMIN = 1;
const USER = 0;


const fetchAttendance = async (data) => {

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

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            userId: userId,
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });

        if (!attendance) {
            const newAttendance = new Attendance({
                userId: userId,
                name: fetchedUser.name,
                createdAt: new Date(),
                hasCheckedIn: false
            });
            await newAttendance.save();

            return {
                status: "success",
                data: newAttendance,
                message: `Attendance fetched`
            };
        }

        return {
		 	"status": "success",
		 	"data" : attendance,
		 	"message": `Attendance fetched`
		};
        
    } catch (err) {
        console.log(`error creating attendance data for ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }

}


const updateAttendance = async (data) => {

    let { userId, token, image, location } = data;

    try {

        userId = userId.trim()
		if (!userId) {
			throw { message: "User Id cannot be empty", code: 400 };
		}

        if (!image) {
			throw { message: "Image url cannot be empty", code: 400 };
		}

		const fetchedUser = await User.findOne({ userId });
		if (!fetchedUser) {
			throw { message: "User doesn't exist", code: 404 };
		}

		if (fetchedUser.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get tomorrow's date at the beginning of the day
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        // First find the attendance record for today
        const existingAttendance = await Attendance.findOne({
            userId: userId,
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });

        if (existingAttendance) {
            if (!existingAttendance.hasCheckedIn) {
                existingAttendance.checkInData = {
                    image: image,
                    time: new Date(),
                    location : location
                };
                existingAttendance.hasCheckedIn = true;
                await existingAttendance.save();
                return {
                    "status": "success",
                    "data": existingAttendance,
                    "message": `Check In Successfull`
                };
            }else if (existingAttendance.hasCheckedIn && !existingAttendance.hasCheckedOut) {
                existingAttendance.checkOutData = {
                    image: image,
                    time: new Date(),
                    location : location
                };
                existingAttendance.hasCheckedOut = true;
                await existingAttendance.save();
                return {
                    "status": "success",
                    "data": existingAttendance,
                    "message": `Check Out Successfull`
                };
            }else{
                throw { message: "User has already checked in and out for today.", code: 409 };
            }
        }else{
            throw { message: "No attendance data found for today", code: 409 };
        }

               
    } catch (err) {
        console.log(`error checking In for ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }

}

const fetchExpense = async (data) => {

    let { userId, token } = data;

    try {
        userId = userId.trim();
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

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get tomorrow's date at the beginning of the day
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        let expense = await Expense.findOne({
            userId: userId,
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });
        
    
        if (!expense) {
           
            const newExpense = new Expense({
                userId: userId,
                name: fetchedUser.name,
                expenseList: [], 
                createdAt: new Date() 
            });
            await newExpense.save();

            return {
                status: "success",
                data: newExpense,
                message: `Expense fetched`
            };
            
        }

        return {
            status: "success",
            data: expense,
            message: `Expense fetched`
        };
        
    } catch (err) {
        console.log(`Error creating expense data for ${userId}: ${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }

}

const updateExpense = async (data) => {

    let { userId, token, expenseList} = data;

    try {

        userId = userId.trim()
		if (!userId) {
			throw { message: "User Id cannot be empty", code: 400 };
		}

        if (!expenseList || expenseList.length === 0) {
			throw { message: "expense list to update not provided", code: 400 };
		}

		const fetchedUser = await User.findOne({ userId });
		if (!fetchedUser) {
			throw { message: "User doesn't exist", code: 404 };
		}

		if (fetchedUser.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

       
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get tomorrow's date at the beginning of the day
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        let expenseData = await Expense.findOne({
            userId: userId,
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });

        if (expenseData) {
            
            expenseData.expenseList = expenseList;
            await expenseData.save();  
            return {
                "status": "success",
                "data": expenseData,
                "message": `expenses updates succesfully`
            };
    
        } else {
            throw { message: "No expense data found for today", code: 409 };
        }
               
    } catch (err) {
        console.log(`error updating expense data for ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }

}

const generateExpenseExcel = async(data) => {
    let { userId, token, email } = data;

    try {

        userId = userId.trim();
        email = email.trim();
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

        if (fetchedUser.level <= USER) {
            throw { message: "Only Admins can fetch excel report", code: 404 };
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Expenses Report');
    
        sheet.columns = [
            { header: 'Date', key: 'createdAt', width: 20, style: { numFmt: 'mm-dd-yyyy' } },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'UserId', key: 'userId', width: 30 },
            { header: 'Expenses', key: 'expenses', width: 50 }
        ];

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await Expense.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        expenses.forEach(expense => {
            const expensesDetails = expense.expenseList.map(item => `${item.description}: ₹${item.cost}`).join(', ');
            sheet.addRow({
                name: expense.name,
                createdAt: expense.createdAt,
                userId: expense.userId,
                expenses: expensesDetails
            });
        });

        await workbook.xlsx.writeFile('expenses.xlsx');

        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject: "Expense Report",
            text: "Please find attached file.",
            attachments: [
                 {
                     filename: 'expenses.xlsx',
                     path: 'expenses.xlsx'
                 }
             ]
        };

        sendEmail(mailOptions);

        return {
            "status": "success",
            "data": null,
            "message": `report generated`
        };

    }catch (err) {
        console.log(`error generating expense excel fetched by ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }
}


const generateAttendanceExcel = async(data) => {
    let { userId, token, email } = data;

    try {

        userId = userId.trim();
        email = email.trim();
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

        if (fetchedUser.level <= USER) {
             throw { message: "Only Admins can fetch excel report", code: 404 };
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Attendance Report');
    
        sheet.columns = [
            { header: 'Date', key: 'createdAt', width: 20, style: { numFmt: 'mm-dd-yyyy' } },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'UserId', key: 'userId', width: 30 },
            { header: 'Check-In Time', key: 'checkInTime', width: 20 },
            { header: 'Check-In Location', key: 'checkInLocation', width: 25 },
            { header: 'Check-In Selfie', key: 'checkInImage', width: 25 },
            { header: 'Check-Out Time', key: 'checkOutTime', width: 20 },
            { header: 'Check-Out Location', key: 'checkOutLocation', width: 25 },
            { header: 'Check-Out Selfie', key: 'checkOutImage', width: 25 },
            { header: 'Has Chekced In', key: 'hasCheckedIn', width: 12 },
            { header: 'Has Checked Out', key: 'hasCheckedOut', width: 12 }
        ];

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59);

        const attendances = await Attendance.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        attendances.forEach(attendance => {
            sheet.addRow({
                name: attendance.name,
                createdAt: attendance.createdAt,
                userId: attendance.userId,
                checkInTime: attendance.checkInData.time ? attendance.checkInData.time.toLocaleString() : 'N/A',
                checkInLocation: `Lat: ${attendance.checkInData.location.latitude}, Long: ${attendance.checkInData.location.longitude}`,
                checkInImage : attendance.checkInData.image,
                checkOutTime: attendance.checkOutData.time ? attendance.checkOutData.time.toLocaleString() : 'N/A',
                checkOutLocation: `Lat: ${attendance.checkOutData.location.latitude}, Long: ${attendance.checkOutData.location.longitude}`,
                checkOutImage : attendance.checkOutData.image,
                hasCheckedIn: attendance.hasCheckedIn ? 'Yes' : 'No',
                hasCheckedOut: attendance.hasCheckedOut ? 'Yes' : 'No'
            });
        });

        await workbook.xlsx.writeFile('attendnace.xlsx');
        
        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject: "Attendance Report",
            text: "Please find attached file.",
            attachments: [
                 {
                     filename: 'attendnace.xlsx',
                     path: 'attendnace.xlsx'
                 }
             ]
        };

        sendEmail(mailOptions);

        return {
            "status": "success",
            "data": null,
            "message": "report generated"
        };

    }catch (err) {
        console.log(`error generating expense excel fetched by ${userId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }
}

const viewUserReport = async (data) => {
    let { userId, token, adminId, day } = data;
    try {

        userId = userId.trim();
        adminId = adminId.trim();

        if (!userId) {
            throw { message: "User Id cannot be empty", code: 400 };
        }

        if (!adminId) {
            throw { message: "Admin Id cannot be empty", code: 400 };
        }

        const fetchedUser = await User.findOne({ userId : userId });
		if (!fetchedUser) {
			throw { message: "User doesn't exist", code: 404 };
		}

        const fetchedAdmin = await User.findOne({ userId : adminId});
		if (!fetchedAdmin) {
			throw { message: "Admin doesn't exist", code: 404 };
		}

		if (fetchedAdmin.token !== token) {
			throw { message: "Invalid session. Please ReLogin", code: 401 };
		}

        if (fetchedAdmin.level <= USER) {
            throw { message: "Only Admins can fetch report", code: 404 };
        }

        const currentDate = new Date();
        const month = currentDate.getMonth();  // Current month (0-indexed)
        const year = currentDate.getFullYear();  // Current year
    
        const date = new Date(year, month, day); 
        const startDate = new Date(date.setHours(0, 0, 0, 0));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1)
    
        const report = { };
        const attendanceData = await Attendance.find({
            userId: userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        })

        if (!attendanceData) {
            report.attendance = null
        }else{
            report.attendance = attendanceData[0]
        }

        const expenseData = await Expense.find({
            userId: userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        })

        if (!expenseData) {
            report.expense = null
        }else{
            report.expense = expenseData[0]
        }

        return {
            "status": "success",
            "data": report,
            "message": "report generated"
        };
        
    } catch (err) {
        console.log(`error fetching report of ${userId} by admin ${adminId}\n${err.message}`);
        throw { message: err.message, code: err.code || 500 }; 
    }
}


export { fetchAttendance , updateAttendance, fetchExpense, viewUserReport,
    updateExpense, generateAttendanceExcel, generateExpenseExcel };