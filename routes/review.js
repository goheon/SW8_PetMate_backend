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
      const uploadimg = uploadFiles['img'] ? uploadFiles['img'].map((file) => file.location) : [];
      const result = await reviewService.writeReview(orderId, req.body, uploadimg);

      res.status(200).json({ message: '리뷰 작성 완료!', result });
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 전체 후기 목록 조회
reviewRouter.get('/:userId', tokenAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const reviews = await reviewService.getReviewList(userId);

    res.status(200).json({
      message: '전체 후기 목록 조회가 완료되었습니다.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

//펫시터 후기 목록 조회
reviewRouter.get('/sitter/:sitterId', async (req, res, next) => {
  try {
    const sitterId = req.params.sitterId;
    const reviews = await reviewService.getReviewListBySitter(sitterId);

    res.status(200).json({
      message: '펫시터 후기 목록 조회가 완료되었습니다.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// 메인 페이지 전체 후기 목록 조회
reviewRouter.get('/all', async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewAllList();

    res.status(200).json({
      message: '페이지 전체 후기 목록 조회가 완료되었습니다.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
