import express from 'express';
import petSitterService from '../services/petsitterService.js';

export const sitterDetailRouter = express.Router();

//펫시터 상세조회
sitterDetailRouter.get('/:sitterId', async (req,res,next)=>{
    try{
        const sitterId = req.params.sitterId;
        const detailInfo=await petSitterService.getPetSitterById(sitterId);

        if (detailInfo===null) {
            return res.status(404).json({ message: '해당하는 펫시터를 찾을 수 없습니다.' });
        }else{
            res.status(200).json(detailInfo)
        };
    }catch(error){
        next(error);
    }
})