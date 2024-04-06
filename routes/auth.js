import express from 'express';
import { User } from '../db/models/userModel.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post('/', async (req, res, next) => {
    try {
    
        const { userId, username, email, password, phone, address, detailAddress } = req.body;
        console.log(req.body)
        await User.create({
            userId,
            username,
            email,
            password,
            phone,
            address,
            detailAddress
        });

        res.status(201).json({message:"회원가입 성공!"});
    }catch (error) {
        next(error); // 에러를 다음 미들웨어로 전달
    }
})

//로그인
//로그아웃