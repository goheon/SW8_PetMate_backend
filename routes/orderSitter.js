import express from 'express';
import petSitterService from '../services/petsitterService.js';
import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
export const orderSitterRouter = express.Router();

//펫시터 상세조회
orderSitterRouter.get('/:sitterId', async (req, res, next) => {
    try {
        const sitterId = req.params.sitterId;
        const detailInfo = await petSitterService.getPetSitterById(sitterId);

        if (detailInfo === null) {
            return res.status(404).json({ message: '해당하는 펫시터를 찾을 수 없습니다.' });
        } else {
            res.status(200).json(detailInfo);
        }
    } catch (error) {
        next(error);
    }
});

//펫시터 상세페이지 in 예약
orderSitterRouter.post('/:sitterId', tokenAuthenticated, async (req, res, next) => {
    try {
        const sitterId = req.params.sitterId;

        if (sitterId === req.userId) {
            res.status(404).send('잘못된 예약 요청입니다.');
        }

        const result = await orderService.addOrder(sitterId, req.body, req.userId);

        res.status(201).json({ message: result.message, orderId: result.orderId });
    } catch (error) {
        next(error);
    }
});
