import express from 'express';
import reviewService from "../services/reviewService.js";
import orderService from "../services/orderService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const booklistRouter = express.Router();

// 전체 예약 내역 조회
booklistRouter.get('/:userId', tokenAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const orders = await orderService.getOrderListOfUser(userId);

    res.status(200).json({
      message: '전체 예약 내역 조회가 완료되었습니다.',
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// 리뷰 작성
booklistRouter.post('/review', tokenAuthenticated, uploadFiles.fields([{ name: 'img', maxCount: 3 }]), async (req, res, next) => {
  try {
    const orderId=req.params.orderId;
    const uploadFiles = req.files['img'];
    const result = await reviewService.writeReview(orderId, req.body, uploadFiles)


  }catch{}
})