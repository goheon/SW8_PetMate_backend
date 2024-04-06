export default (err,req,res,next)=>{
    const statusCode = err.statusCode || 500 //오류에 stautscode없으면 500
    res.status(500).json({
        statusCode: res.statusCode,
        errMessage:err.message
})
}