import express from 'express';
import userService from "../services/userService.js";

export const userRouter = express.Router();

//회원 정보 조회
userRouter.get('/:userId', async (req,res,next)=>{
    try{
        const userId = req.params.userId
        const searchUser=await userService.getUserInfo(userId);

        res.status(200).json({
            username:searchUser.username,
            email: searchUser.email,
            password: searchUser.password,
            phone: searchUser.phone,
            address: searchUser.address,
            detailAddress: searchUser.detailAddress,
        })
        }catch (error) {
            next(error); // 에러를 다음 미들웨어로 전달
        }
})