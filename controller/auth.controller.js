import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/env.js";


export const signup=async(req,res,next)=>{
     const session=await mongoose.startSession();
     session.startTransaction();
     try{

        const {name,email,password}=req.body;

        const existinguser=await User.findOne({email})
        if (existinguser){
            const error= new Error("User already exists");
            error.statusCode=409;
            throw error;
        }

        const salt=await bcrypt.genSalt(10);

        const hashpassword=await bcrypt.hash(password,salt);

        const newuser=await User.create([{name,email,password:hashpassword}],{session});

        const token=jwt.sign({userId:newuser._id}, JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        await session.commitTransaction();

        res.status(200).json({
            success:true,
            message:"User registered successfully",
            data:{
                token,
                user:{
                    id:newuser._id,
                    name:newuser.name,
                    email:newuser.email
                }
            }
        })
     }
     catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
     }
}


export const signin=async(req,res,next)=>{
    
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});

        if (!user){

            const error=new Error("Invalid email or password");
            error.statusCode=404;
            throw error;
        }

        const ispasswordcorrect=await bcrypt.compare(password,user.password);

        if (!ispasswordcorrect){
            const error=new Error("Invalid email or password");
            error.statusCode=401;
            throw error;
        }

        const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                token,
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
            }
        })
    }
    catch(err){
        next(err);
    }
}

export const signout=async(req,res,next)=>{
    // TODO: Implement signout logic
}