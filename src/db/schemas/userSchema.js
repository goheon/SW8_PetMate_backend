import mongoose from 'mongoose';
const {Schema}=mongoose;

const userSchema=new Schema({
    username:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:Number,
        required:true,
    },
    isRole:{
        type:String,
        required:false,
    },
    deletedAt:{
        type:Date,
        required: false,
    }
})

export default userSchema;