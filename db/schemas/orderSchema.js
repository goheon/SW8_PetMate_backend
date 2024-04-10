import mongoose from 'mongoose';
import shortId from './types/shortId.js';

const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  sitterId: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    ...shortId,
    required: true
  },

})

export default orderSchema;