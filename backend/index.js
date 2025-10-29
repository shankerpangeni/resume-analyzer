import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDb } from './src/utils/connectDb.js';
import userRoutes from './src/routes/user.route.js';
import jobRoutes from './src/routes/job.route.js';
import resumeRoutes from './src/routes/resume.route.js';
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
    methods: ['GET' , 'POST' , 'PUT' , 'DELETE'],
    allowHeaders: ['Content-Type' , 'Authorization'],
}

app.use(cors(corsOptions));


//user api

app.use('/api/v1/user' , userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/resume' , resumeRoutes )

app.listen(process.env.PORT || 3000 , (req , res) => {
    console.log('Backend running successfully');
    connectDb();

})