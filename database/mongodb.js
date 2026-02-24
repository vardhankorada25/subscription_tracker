import mongoose from 'mongoose';

import {DB_URL,NODE_ENV} from '../config/env.js';

if (!DB_URL) {
     throw new Error('Database URL is not defined in environment variables');
}

const connectDB=async()=>{
    try{

        await mongoose.connect(DB_URL);
        console.log(`MongoDB connected successfully in ${NODE_ENV} mode`);
    }
    catch (error){
           console.error('Error connecting to MongoDB:', error);
           process.exit(1);
    }

}

export default connectDB;