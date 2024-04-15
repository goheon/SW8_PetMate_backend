import express from 'express';
import reviewService from '../services/reviewService.js';
import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const reviewRouter = express.Router();

// 전체 후기 목록 조회
reviewRouter.get('/review/:orderId', tokenAuthenticated, async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewList();

    for (let review of reviews) {
      const order = await orderService.checkOrderId(review.orderId);
      review.sitterId = order.sitterId;
      review.userId = order.userId;
    }

    res.status(200).json({
      message: '전체 후기 목록 조회가 완료되었습니다.',
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;