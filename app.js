import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// models
import './config/database.js';
import './models/user.model.js';

// routes
import indexRoute from './routes/index.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';

dotenv.config();
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(indexRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);

export default app;
