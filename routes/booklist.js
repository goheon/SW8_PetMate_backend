import express from 'express';
import userService from "../services/userService.js";
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

// 진행중인 예약 내역 조회
booklistRouter.get('/booklist/:orderId', tokenAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const order = await userService.getOngoingOrder(userId, orderId);

    res.status(200).json({
      message: '진행중인 예약 내역 조회가 완료되었습니다.',
      data: order
    });
  } catch (error) {
    next(error);
  }
});
export default booklistRouter;