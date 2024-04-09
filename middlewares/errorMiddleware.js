export default (err,req,res,next)=>{
    const statusCode = err.statusCode || 500 //오류에 stautscode없으면 500
    res.status(statusCode).json({
        statusCode: statusCode,
        errMessage:err.message
})
}