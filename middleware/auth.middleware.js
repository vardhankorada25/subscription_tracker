import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.js';
import user from '../models/user.model.js';
console.log(JWT_SECRET)
const authorize=async (req,res,next) => {
    try{
        let token;
        // console.log("header", req.headers.authorization);
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            token=req.headers.authorization.split(' ')[1];
        }
        if (!token){
            return res.status(401).json({message:"unauthorized"})
        }
        const decode=jwt.verify(token,JWT_SECRET);
        const User=await user.findById(decode.userId)
        // console.log("decode._id", decode.userId);
        if (!User){return res.status(401).json({message:"Unauthorized"})}
        req.user=User;
        next();
    }
    catch(err){
        res.status(401).json({message:"Unauthorized",error:err.message});
    }
}

export default authorize;   