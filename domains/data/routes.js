import express from "express";

const dataRoutes = express.Router();
import { readFileSync } from 'fs';
import verifyToken from "../../middleware/auth.js";

// Load the words data
const wordsData = JSON.parse(readFileSync('words.json', 'utf-8'));

dataRoutes.get('/thirty', async(req, res) => {

	const randomWords = [];
    const wordCount = wordsData.length;
    
    while (randomWords.length < 30) {
        const randomIndex = Math.floor(Math.random() * wordCount);
        const randomWord = wordsData[randomIndex];
        
        // Ensure no duplicate words
        if (!randomWords.includes(randomWord)) {
            randomWords.push(randomWord);
        }
    }

	res.json(randomWords);
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

