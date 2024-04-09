import express from 'express';
import petSitterService from '../services/petsitterService.js';

export const sitterDetailRouter = express.Router();

//펫시터 상세조회
sitterDetailRouter.get('/:sitterId', async (req,res,next)=>{
    try{
        const sitterId = req.params.sitterId;
        const detailInfo=petSitterService.getPetSitterById(sitterId);
        res.status(200).json(detailInfo);
    }catch(error){
        next(err);
    }
})