import express from 'express';
import ReviewService from '../services/reviewService.js';

import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { uploadFiles } from '../middlewares/imageMiddleware.js';

export const reviewRouter = express.Router();
const reviewService = new ReviewService();

// 리뷰 작성
reviewRouter.post(
  '/:orderId',
  tokenAuthenticated,
  uploadFiles.fields([{ name: 'img', maxCount: 3 }]),
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const uploadFiles = req.files;
      const uploadimg = uploadFiles['img'] ? uploadFiles['img'].map((file) => file.path) : [];
      await reviewService.writeReview(orderId, req.body, uploadimg);

      res.status(200).send('리뷰 작성 완료!');
    } catch (error) {
      next(error);
    }
  },
);


// 전체 후기 목록 조회
reviewRouter.get('/:orderId', tokenAuthenticated, async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewList();

    res.status(200).json({
      message: '전체 후기 목록 조회가 완료되었습니다.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
