import user from '../models/user.model.js';

export const getUsers = async (req,res,next) => {

    try{
        const users=await user.find();
        res.status(200).json({sucess:true,data:users});
    }
    catch(err){
        next(err);
    }
}



export const getUser = async (req,res,next) => {

    try{
        const userDoc=await user.findById(req.params.id).select('-password');
        if (!userDoc){
            const error =new Error("User not found");
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({sucess:true,data:userDoc});
    }
    catch(err){
        next(err);
    }
}