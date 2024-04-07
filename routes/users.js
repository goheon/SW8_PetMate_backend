import express from 'express';
import userService from "../services/userService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const userRouter = express.Router();

//회원 정보 조회
userRouter.get('/:userId', tokenAuthenticated, async (req, res, next) => {
    try {
        const userId = req.params.userId
        const searchUser = await userService.getUserInfo(userId);

        res.status(200).json({
            username: searchUser.username,
            email: searchUser.email,
            password: searchUser.password,
            phone: searchUser.phone,
            address: searchUser.address,
            detailAddress: searchUser.detailAddress,
        })
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
userRouter.delete('/:userId', tokenAuthenticated, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await userService.deleteUser(userId);

        res.status(200).json({
            message: '회원 탈퇴가 완료되었습니다.'
        });
    } catch (error) {
        next(error);
    }
});
