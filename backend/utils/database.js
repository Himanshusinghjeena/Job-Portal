import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({})

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongo DB Connected Succesfully")
    }catch(err){
        console.log("Error when Connected to Mongo DB");
        console.log(err)
    }
}
export default connectDB;