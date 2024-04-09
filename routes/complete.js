import express from 'express';
import orderService from "../services/orderService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { User } from '../db/index.js';
export const completeRouter = express.Router();

// 예약완료 (사용자)
completeRouter.patch('/', tokenAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    // 예약 완료 처리
    await orderService.completeOrder(userId, orderId);

    res.status(200).json({
      message: '예약이 완료되었습니다.'
    });
  } catch (error) {
    next(error);
  }
});
export default completeRouter;
