import express from 'express';
import userService from "../services/userService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { uploadFiles } from "../middlewares/imageMiddleware.js";

export const userRouter = express.Router();

//회원 정보 조회
userRouter.get('/', tokenAuthenticated, async (req, res, next) => {
    try {
        const searchUser = await userService.getUserInfo(req.userId);

        res.status(200).json(searchUser);
    } catch (error) {
        next(error); // 에러를 다음 미들웨어로 전달
    }
})

//회원 정보 수정
userRouter.put('/', tokenAuthenticated, async (req, res, next) => {
    try {
        const userInfo = req.body;

        const updatedUser = await userService.updateUserInfo(req.userId, userInfo);

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
        userService.deleteUser(req.userId);
        res.status(200).json({ message: "탈퇴 완료!" })

        //나중에 추가할 내용: 예약 진행상태면 탈퇴불가
    } catch (error) {
        next(error);
    }
});

//펫시터 등록
userRouter.post('/sitter', tokenAuthenticated, uploadFiles.fields([{ name: 'img', maxCount: 3 }]), async (req, res, next) => {
    try {
        const uploadFiles = req.files['img'];
        const uploadimg = uploadFiles ? uploadFiles.map(file => file.path) : ["public/images/default.jpg"];
        const result = await userService.registerSitter(req.userId, req.body, uploadimg)

        if (result.success) {
            res.status(201).json({ message: result.message, sitterId: result.sitterId });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        next(error);
    }
})
