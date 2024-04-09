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
  experience: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
})

export default petsitterSchema;