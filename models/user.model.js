import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'user name is required'],
        trim:true,
        minlength:[3,'name must be at least 3 characters long'],
        maxlength:[50,'name must be at most 50 characters long'],
    },

    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'please fill a valid email address'],
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minlength:6,
    },
}, {timestamps:true});

const user=mongoose.model('User',userSchema);

export default user;