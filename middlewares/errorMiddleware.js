import express from 'express';

export default (err,req,res,next)=>{
    res.status(500).json({
        statusCode: res.statusCode,
        errMessage:err.message
})
}