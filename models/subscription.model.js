import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema({

    name:{
        type:string;
        required:[true,'subscription name is required'],
        trim:true,
        minlength:2,
        maxlength:100,
    },
    price:{
        type:Number,
        required:[true,'subscription price is required'],
        min:[0,'price cannot be negative'],
    },
    currency:{
        type:String,
        enum:['USD','EUR','GBP','INR','JPY'],
        default:'USD',
    },
    frequency:{
        type:String,
        enum:['monthly','yearly','weekly','daily'],
    },
    category:{
        type:String,
        enum:['entertainment','education','productivity','health','other'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:
    {
        type:String,
        enum:['active','inactive','cancelled','paused'],
        default:'active',
    },
    startdate:{
        type:Date,
        required:true,
        validator:(value)=>value <= new Date(),
        message:'start date cannot be in the future',   
    },
    renewalDate:{
        type:Date,
        required:true,
        validator:function(value){
            return value > this.startdate;
        },
        message:'Renewal date must be after start date', 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true,
        index:true,
    }
},{timestamps:true});

subscriptionSchema.pre('save',function(next){
       if (!this.renewaDate){
         const renewalPeriods={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
         };

         this.renewalDate=new Date(this.startdate);
         this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
       }

       if (this.renewalDate <= new Date()){
        this.status="expired";
       }
         next();
});

const Subscription=mongoose.model('Subscription',subscriptionSchema);

export default Subscription;