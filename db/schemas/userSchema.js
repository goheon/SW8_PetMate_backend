import mongoose from 'mongoose';
import shortId from './types/shortId.js';
const { Schema } = mongoose;

export const userSchema = new Schema({
    userId: {
        type: String,
        ...shortId,
        required: true
    },

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    detailAddress: {
        type: String,
        required: true,
    },
    isRole:{
        type:String,
        default: undefined,
    },
    deletedAt:{
        type:Date,
        required: false,
    },
    point: {
        type: Number,
        required: false,
    }
})

export default userSchema;