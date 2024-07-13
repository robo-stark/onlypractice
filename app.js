import express from 'express';
import './config/db.js';
import routes from './routes/index.js';

const bodyParser = express.json;


const app = express();
app.use(express.json({}));
app.use(express.json({ extended : true }));
app.use(bodyParser());
app.use("/api", routes);

export default app;
