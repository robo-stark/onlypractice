import express from "express";

const dataRoutes = express.Router();
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

import verifyToken from "../../middleware/auth.js";


dataRoutes.get('/synonyms', async(req, res) => {

    try {
        // Read the JSON file
        const filePath = path.join(__dirname, 'domains', 'data', 'synonyms.json');
        const data = fs.readFileSync(filePath, 'utf8');
        // Parse the JSON data
        const synonyms = JSON.parse(data);
        // Send the JSON data as a response
        res.json(synonyms);
    } catch (error) {
        console.error('Error reading synonyms.json:', error);
        res.status(500).send('Internal Server Error');
    }
	
})


















export default dataRoutes;


// dataRoutes.post('/attendance', verifyToken, async(req, res) => {
// 	try {
// 		const data = await fetchAttendance(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

// dataRoutes.post('/attendance/update', verifyToken, async(req, res) => {
// 	try {

// 		const data = await updateAttendance(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })



// dataRoutes.post('/expense', verifyToken, async(req, res) => {
// 	try {
// 		const data = await fetchExpense(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

// dataRoutes.post('/expense/update', verifyToken, async(req, res) => {
// 	try {
// 		const data = await updateExpense(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

// dataRoutes.post('/excel/expense', verifyToken, async(req, res) => {
// 	try {
// 		const data = await generateExpenseExcel(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

// dataRoutes.post('/excel/attendance', verifyToken, async(req, res) => {
// 	try {
// 		const data = await generateAttendanceExcel(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

// dataRoutes.post('/userData', verifyToken, async(req, res) => {
// 	try {
// 		const data = await viewUserReport(req.body);
// 		res.status(200).json(data);

// 	}catch(err) {
// 		const statusCode = err.code || 500;
//         res.status(statusCode).json({
//             "status": "failed",
//             "data": null,
//             "message": err.message
//         });
// 	}
// })

