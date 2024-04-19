import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  sitterId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: false,
  },
  starRate: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default reviewSchema;
