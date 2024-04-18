import express from 'express';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import pointService from '../services/pointService.js';

export const pointRouter = express.Router();

//포인트 증가감소
pointRouter.patch('/:orderId', tokenAuthenticated, async (req, res, next) => {
  try {
    const price = req.body.totalPrice;
    const orderId = req.params.orderId;
    const result = await pointService.pointFunction(orderId, price);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
