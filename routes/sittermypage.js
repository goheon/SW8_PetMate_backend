import express from 'express';
import petSitterService from '../services/petsitterService.js';
import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const sitterMyPageRouter = express.Router();

// 펫시터 정보 수정
sitterMyPageRouter.put('/:sitterId', tokenAuthenticated, async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const sitterInfo = req.body;
    const updatedPetSitter = await petSitterService.updatePetSitter(token, sitterInfo);

    res.status(200).json({
      message: '펫시터 정보가 수정되었습니다.',
      data: updatedPetSitter,
    });
  } catch (error) {
    next(error);
  }
});

// 예약 진행
sitterMyPageRouter.patch('/:orderId/progress', tokenAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await orderService.updateOrderStatus(orderId, 'In Progress');

    res.status(200).json({
      message: '예약이 진행되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// 예약 수락
sitterMyPageRouter.patch('/:orderId/accept', tokenAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await orderService.updateOrderStatus(orderId, 'Accepted');

    res.status(200).json({
      message: '예약이 수락되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// 예약 거절
sitterMyPageRouter.patch('/:orderId/reject', tokenAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await orderService.updateOrderStatus(orderId, 'Rejected');

    res.status(200).json({
      message: '예약이 거절되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

export default sitterMyPageRouter;

