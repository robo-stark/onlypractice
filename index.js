import app from './app.js';

const { PORT } = process.env;


const startApp = () => {
	app.listen(PORT, 
	console.log(`server running on port ${PORT}`)
	);
};

startApp();

