import mongoose from "mongoose";
import userSchema from "./schemas/userSchema.js"
import orderSchema from "./schemas/orderSchema.js";
import petsitterSchema from "./schemas/petsitterSchema.js"
import reviewSchema from "./schemas/reviewSchema.js";

export const User = mongoose.model('User', userSchema);
export const Order = mongoose.model('Order', orderSchema);
export const PetSitter = mongoose.model("Petsitter", petsitterSchema);
export const Review = mongoose.model("Review", reviewSchema);

