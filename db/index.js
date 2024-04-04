import mongoose from "mongoose";
import userSchema from "./schemas/userSchema";
import orderSchema from "./schemas/orderSchema";
import petsitterSchema from "./schemas/petsitterSchema";
import reviewSchema from "./schemas/reviewSchema";

export const User = mongoose.model('User', userSchema);
export const Order = mongoose.model('Order', orderSchema);
export const Petsitter = mongoose.model("Petsitter", petsitterSchema);
export const Review = mongoose.model("Review", reviewSchema);
