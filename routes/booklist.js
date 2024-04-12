import express from 'express';
// import reviewService from "../services/reviewService.js";
import orderService from "../services/orderService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const booklistRouter = express.Router();

// 전체 예약 내역 조회
booklistRouter.get('/', tokenAuthenticated, async (req, res, next) => {
  try {
    const userId = req.cookies.jwt;
    const orders = await orderService.getOrderListOfUser(userId);
    console.log(orders);

    if (orders === null) {
      return res.status(404).json({ message: '전체 예약 내역이 없습니다.' });
    } else {
      res.status(200).json({
        message: '전체 예약 내역 조회가 완료되었습니다.',
        data: orders
      });
    };
  } catch (error) {
    next(error);
  }
});

// // 진행중인 예약 내역 조회
// booklistRouter.get('/booklist/:orderId', tokenAuthenticated, async (req, res, next) => {
//   try {
//     const orderId = req.params.orderId;
//     const userId = req.user.id;

//     const order = await userService.getOngoingOrder(userId, orderId);

//     res.status(200).json({
//       message: '진행중인 예약 내역 조회가 완료되었습니다.',
//       data: order
//     });
//   } catch (error) {
//     next(error);
//   }
// });
export default booklistRouter;