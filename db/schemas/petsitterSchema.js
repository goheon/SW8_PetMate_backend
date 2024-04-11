import mongoose from 'mongoose';
import shortId from './types/shortId.js'; 
const { Schema } = mongoose;

const petsitterSchema = new Schema({
  sitterId: {
    type: String,
    ...shortId,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  phone:{
    type:Number,
    required:true,
  },
  title: {
    type: String,
    required: true,
  },
  experience: {
    type: [String],
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  hourlyRate: [{
    size:{type: String, required:true},
    rate:{type:Number, required:true}
  }],
  image: {
    type: [String],
    default: "public/images/default.png"
  },
  type: {
    type: [String],
    required: true,
  }
})

export default petsitterSchema;