import express from 'express';
import userService from "../services/userService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { User } from '../db/index.js';
import jwt from 'jsonwebtoken';

export const userRouter = express.Router();

//회원 정보 조회
userRouter.get('/:userId', tokenAuthenticated, async (req, res, next) => {
    try {
        const userId = req.params.userId
        const searchUser = await userService.getUserInfo(userId);

        res.status(200).json(searchUser);
    } catch (error) {
        next(error); // 에러를 다음 미들웨어로 전달
    }
})

//회원 정보 수정
userRouter.put('/:userId', tokenAuthenticated, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userInfo = req.body;
        const updatedUser = await userService.updateUserInfo(userId, userInfo);

        res.status(200).json({
            message: '회원 정보가 수정되었습니다.',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
});

//회원 탈퇴
userRouter.delete('/resign', tokenAuthenticated, async (req, res, next) => {
    try {
        //쿠키에서 유저 이메일 추출
        const token = req.cookies.jwt;
        userService.deleteUser(token);
        res.status(200).json({message:"탈퇴 완료!"})

        //나중에 추가할 내용: 예약 진행상태면 탈퇴불가
    } catch (error) {
        next(error);
    }
});
