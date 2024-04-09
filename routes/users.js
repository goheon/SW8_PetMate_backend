import express from 'express';
import userService from "../services/userService.js";
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import { uploadFiles } from "../middlewares/imageMiddleware.js";
import { User } from '../db/index.js';
import jwt from 'jsonwebtoken';

import { PetSitter } from '../db/index.js';

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

//펫시터 등록
userRouter.post('/:userId/sitter', tokenAuthenticated, uploadFiles.fields([{name:'img',maxCount:3}]), async (req,res,next)=>{
    try{
        const userId=req.params.userId;
        const user = await User.findOne({ userId: userId });

        const uploadFiles=req.files['img'];
        const uploadimg = uploadFiles ? uploadFiles.map(file => file.path) : ["public/images/default.jpg"];

        const { sitterId, type, phone, introduction, experience, hourlyRate, title } = req.body;

        const parsedHourlyRate = JSON.parse(hourlyRate);
        const parsedType = JSON.parse(type);

        if (user.isRole === "1") {
            return res.status(400).json({ message: '이미 펫시터 계정입니다.' });
        }

        await PetSitter.create({
            sitterId,
            userId,
            image: uploadimg,
            type: parsedType,
            phone,
            introduction,
            experience,
            hourlyRate: parsedHourlyRate,
            title,
            isRole: "1"
        })
        await User.findOneAndUpdate(
            {userId: userId},
            {isRole: "1"},
            { new: true } //업데이트된 정보 반환
        )

        res.status(201).json({ message: '펫시터 등록 완료!' });
    } catch (error) {
        next(error);
    }
})
