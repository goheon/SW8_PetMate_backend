import express from 'express';
import petSitterService from '../services/petsitterService.js';

export const sitterslistRouter = express();

//전체 펫시터 목록
sitterslistRouter.get('/', async (req, res, next) => {
  try {
    const result = await petSitterService.getAllPetSitters();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
