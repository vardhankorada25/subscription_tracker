import mongoose from "mongoose";

const renewalPeriods = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
};

const calculateRenewalDate = (startdate, frequency) => {
    if (!startdate || !frequency || !renewalPeriods[frequency]) return undefined;
    const renewalDate = new Date(startdate);
    renewalDate.setDate(renewalDate.getDate() + renewalPeriods[frequency]);
    return renewalDate;
};

const subscriptionSchema=new mongoose.Schema({

    name:{
        type: String,
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
        enum:['active','inactive','cancelled','paused','expired'],
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

subscriptionSchema.pre('save',function(){
    if (!this.renewalDate || this.isModified('startdate') || this.isModified('frequency')){
         this.renewalDate = calculateRenewalDate(this.startdate, this.frequency);
    }

       if (this.renewalDate <= new Date()){
        this.status="expired";
       }
});

subscriptionSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate() || {};
    const payload = update.$set ? update.$set : update;

    const hasStartDateChange = Object.prototype.hasOwnProperty.call(payload, 'startdate');
    const hasFrequencyChange = Object.prototype.hasOwnProperty.call(payload, 'frequency');
    const hasRenewalDateChange = Object.prototype.hasOwnProperty.call(payload, 'renewalDate');

    if ((hasStartDateChange || hasFrequencyChange) && !hasRenewalDateChange) {
        const currentDoc = await this.model.findOne(this.getQuery()).select('startdate frequency').lean();
        const startdate = payload.startdate ?? currentDoc?.startdate;
        const frequency = payload.frequency ?? currentDoc?.frequency;

        if (startdate && frequency) {
            payload.renewalDate = calculateRenewalDate(startdate, frequency);
        }
    }

    if (update.$set) {
        update.$set = payload;
    } else {
        Object.assign(update, payload);
    }
    this.setUpdate(update);
});

const Subscription=mongoose.model('Subscription',subscriptionSchema);

export default Subscription;