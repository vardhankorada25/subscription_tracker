import express from 'express';
import {PORT} from './config/env.js';
import cookieParser from 'cookie-parser';
import  userrouter from './routes/user.routers.js';
import  subscriptionrouter from './routes/subscription.routers.js'; 
import authrouter from './routes/auth.routers.js';
import connectDB  from './database/mongodb.js';
import errormiddleware from './middleware/error.middleware.js';
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/auth',authrouter);
app.use('/api/v1/users',userrouter);
app.use('/api/v1/subscriptions',subscriptionrouter);
app.use(errormiddleware);
app.get('/',(req,res)=>{

    res.send( "Hello World");
})

await connectDB();

app.listen(PORT,async()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})

export default app;