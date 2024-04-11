import mongoose from 'mongoose';
import shortId from './types/shortId.js';
const { Schema } = mongoose;

const orderSchema = new Schema({
  orderId: {
    type: String,
    ...shortId,
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
  pets: [{
    type: { type: String, required: true },
    count: { type: Number, required: true }
  }],
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
    default: "예약요청",
  },
  detailInfo: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }

})

export default orderSchema;