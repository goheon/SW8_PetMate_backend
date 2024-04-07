import jwt from "jsonwebtoken";

export const tokenAuthenticated=(req,res,next)=>{
    //쿠키에서 토큰 가져옴
    const token=req.cookies.jwt;

    if(token==null){
        return res.status(401);
    }
    //토큰 유효한지 확인(verify)
    const key=process.env.SECRET_KEY;
    jwt.verify(token,key,(err,user)=>{
        if(err){
            return res.send("유효하지 않은 토큰입니다.")
        }
        req.user=user;
        next();
    })
}