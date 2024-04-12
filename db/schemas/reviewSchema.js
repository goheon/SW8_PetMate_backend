import mongoose from "mongoose";

const {Schema}=mongoose;

const reviewSchema=new Schema({
    //게시글을 구별 할 수 있는 key값? orderId/ createdAt/ reviewId
    orderId:{
        type:String,
        required: true
    },
    userId:{
        type:String,
        required: true
    },
    sitterId:{
        type:String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    comment:{
        type:String,
        required:true,
    },
    image:{
        type: [String],
        required: false,
    },
    starRate:{
        type: Number,
        required:true 
    }

})

export default reviewSchema;