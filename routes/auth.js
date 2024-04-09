import express from 'express';
import { setUserToken } from '../utils/jwt.js';
import userService from '../services/userService.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post('/signup', async (req, res, next) => {
    try {

        const { userId, username, email, password, phone, address, detailAddress } = req.body;

        await userService.createUser({
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
authRouter.post('/login',async (req,res,next)=>{
    try{
        //사용자 인증
        const {email, password}=req.body;

        const user=await userService.getUserToken(email,password)

        //인증 성공시 토큰 생성
        setUserToken(res,user)
    }catch(error){
        next(error);
    }
})

//로그아웃