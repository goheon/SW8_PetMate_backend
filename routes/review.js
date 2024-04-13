import express from 'express';
import ReviewService from '../services/reviewService.js'
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { uploadFiles } from '../middlewares/imageMiddleware.js';

export const reviewRouter=express.Router();
const reviewService = new ReviewService();

// 리뷰 작성
reviewRouter.post('/:orderId', tokenAuthenticated, uploadFiles.fields([{ name: 'img', maxCount: 3 }]), async (req, res, next) => {
  try {
    const orderId=req.params.orderId;
    const uploadFiles = req.files['img'];
    const uploadimg = uploadFiles ? uploadFiles.map(file => file.path) : [];
    await reviewService.writeReview(orderId, req.body, uploadimg);

    res.status(200).send("리뷰 작성 완료!");

  }catch(error){
    next(error);
  }
})