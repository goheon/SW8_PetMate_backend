import express from 'express';
import userService from "../services/userService.js";

export const userRouter = express.Router();

//회원 정보 조회
userRouter.get('/:userId', async (req,res)=>{
    try{
        const userId = req.params.userId
        const searchUser=await userService.getUserInfo(userId);

        res.status(200).json({
            username:searchUser.username,
            email: searchUser.email,
            password: searchUser.password,
            phone: searchUser.phone,
            address: searchUser.address,
            detailAddress: searchUser.password,
        })
        }catch(error){
            console.error("정보 조회 중 오류 발생",error);
            res.status(500).json({message:"서버오류"});
    }
})