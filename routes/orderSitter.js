import express from 'express';
import petSitterService from '../services/petsitterService.js';
import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { uploadFiles } from '../middlewares/imageMiddleware.js';
export const orderSitterRouter = express.Router();

//펫시터 상세조회
orderSitterRouter.get('/:sitterId', async (req, res, next) => {
    try {
        const sitterId = req.params.sitterId;
        const detailInfo = await petSitterService.getPetSitterById(sitterId);

        if (detailInfo === null) {
            return res.status(404).json({ message: '해당하는 펫시터를 찾을 수 없습니다.' });
        } else {
            res.status(200).json(detailInfo)
        };
    } catch (error) {
        next(error);
    }
})

//펫시터 상세페이지 in 예약
orderSitterRouter.post('/:sitterId', async (req, res, next) => {
    try {
        const sitterId = req.params.sitterId;
        const token = req.cookies.jwt
        if (!token) {
            res.status(400).send("로그인한 사용자만 예약이 가능합니다.");
        }
        const result = await orderService.addOrder(sitterId, req.body, token);

        res.status(201).json({ message: result.message, orderId: result.orderId });
    } catch (error) {
        next(error);
    }
})

//펫시터 후기 목록 조회
orderSitterRouter.get('/review/:sitterId', tokenAuthenticated, async (req, res, next) => {
    try {
        const reviews = await reviewService.getReviewList();

        res.status(200).json({
            message: '펫시터 후기 목록 조회가 완료되었습니다.',
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
});