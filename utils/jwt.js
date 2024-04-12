import jwt from "jsonwebtoken";

export const setUserToken=(res,user)=>{
    //DB데이터 가져옴
    const { userId }=user;
    const secret=process.env.SECRET_KEY;

    //user정보를 가지고 토큰 생성
    const token=jwt.sign({userId},secret)

    //토큰을 쿠키로 전달
    res.cookie('jwt', token, { httpOnly: false });
    res.send("로그인 성공!");
} 

