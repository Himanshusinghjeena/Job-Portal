import express from 'express';
import cors from 'cors';
import  cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/database.js';
import userRoute from './routes/userRoutes.js';
import companyRoute from './routes/companyRoutes.js';
import jobRoute from './routes/jobRoutes.js'
import applicationRoute from './routes/applicationRoutes.js'
dotenv.config({})

const app = express();

  


// middleware 
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
const corsOptions ={
    origin:'https://job-portal-frontend-u1fz.onrender.com',
    credentials: true
}
app.use(cors(corsOptions))


// api's
app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/jobs",jobRoute)
app.use("/api/v1/application",applicationRoute)

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on port ${PORT}`);
})
