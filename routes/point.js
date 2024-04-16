import express from 'express';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import pointService from '../services/pointService.js';

export const pointRouter = express.Router();

//포인트 감소
pointRouter.patch('/pointdec', tokenAuthenticated, async (req, res, next) => {
  try {
    const price = req.body.totalPrice;
    const result = await pointService.pointDecrease(req.userId, price);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 포인트 증가
pointRouter.patch('/pointinc', tokenAuthenticated, async (req, res, next) => {
  try {
    const price = req.body.totalPrice;
    const result = await pointService.pointIncrease(req.userId, price);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});