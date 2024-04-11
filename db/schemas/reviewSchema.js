import mongoose from "mongoose";

const {Schema}=mongoose;

const reviewSchema=new Schema({
    userId:{
        type:String,
        required: true
    },
    sitterId:{
        type:String,
        required: true
    },
    comment:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required: true,
    },
    rate:{
        type: Number,
        required:true 
    }
})

export default reviewSchema;