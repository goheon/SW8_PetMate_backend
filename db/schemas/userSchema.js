import mongoose from 'mongoose';
import shortId from './types/shortId.js';
const { Schema } = mongoose;

export const userSchema = new Schema({
  userId: {
    type: String,
    ...shortId,
    required: true,
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
    type: String,
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
  isRole: {
    type: String,
    default: undefined,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
  image: {
    type: [String],
    default: 'https://elice-project2-pet-mate.s3.ap-northeast-2.amazonaws.com/contents/default_profile.png',
  },
  point: {
    type: Number,
    default: 500000,
  },
});

export default userSchema;
