import express from 'express';
import petSitterService from '../services/petsitterService.js';
import orderService from '../services/orderService.js';
import userService from '../services/userService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';

export const sitterMyPageRouter = express.Router();
import { uploadFiles } from '../middlewares/imageMiddleware.js';

//펫시터 정보 조회
sitterMyPageRouter.get('/', tokenAuthenticated, async (req, res, next) => {
  try {
    const detailInfo = await petSitterService.getPetSitterByUserId(req.userId);
    if (detailInfo === null) {
      return res.status(404).json({ message: '해당하는 펫시터를 찾을 수 없습니다.' });
    } else {
      res.status(200).json(detailInfo);
    }
  } catch (error) {
    next(error);
  }
});

// 펫시터 정보 수정
sitterMyPageRouter.put('/:sitterId', uploadFiles.fields([{ name: 'img', maxCount: 3 }]), async (req, res, next) => {
  try {
    const sitterId = req.params.sitterId;
    const sitterInfo = req.body;
    const uploadFiles = req.files['img'];
    const uploadimg = uploadFiles ? uploadFiles.map((file) => file.path) : ['public/images/default.jpg'];
    const updatedPetSitter = await petSitterService.updatePetSitter(sitterId, sitterInfo, uploadimg);

    console.log(sitterId, sitterInfo);

    if (sitterId === null) {
      return res.status(404).json({ message: '일치하는 펫시터가 없습니다.' });
    } else {
      res.status(200).json({
        message: '펫시터 정보가 수정되었습니다.',
        data: updatedPetSitter,
      });
    }
  } catch (error) {
    next(error);
  }
});

// 예약 요청
sitterMyPageRouter.patch('/:orderId/progress', async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const newState = '요청';
    await orderService.updateOrderStatus(orderId, newState);

    res.status(200).json({
      message: '주문 상태가 예약 요청으로 변경되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// 예약 수락 -> 진행
sitterMyPageRouter.patch('/:orderId/accept', async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const newState = '진행중';
    await orderService.updateOrderStatus(orderId, newState);

    res.status(200).json({
      message: '주문 상태가 예약 진행으로 변경되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// 예약 거절
sitterMyPageRouter.patch('/:orderId/reject', async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const newState = '취소';
    await orderService.updateOrderStatus(orderId, newState);

    res.status(200).json({
      message: '주문 상태가 예약 취소로 변경되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

//예약 내역 조회
sitterMyPageRouter.get('/orderlist/:sitterId', async (req, res, next) => {
  try {
    const sitterId = req.params.sitterId;
    const result = await petSitterService.sitterOrderList(sitterId);

    const ordersWithSitterInfo = await Promise.all(
      result.map(async (order) => {
        const userInfo = await userService.getUserInfo(order.userId);
        const petSitterInfo = await petSitterService.getPetSitterById(order.sitterId);
        const petSitterUserInfo = await userService.getUserInfo(petSitterInfo.sitterInfo.userId);

        const userphone = userInfo.phone;
        const useraddress = userInfo.address;
        const userdetailaddress = userInfo.detailAddress;
        const username = userInfo.username;
        const sitterphone = petSitterUserInfo.phone;
        const sitteraddress = petSitterUserInfo.address;
        const sittername = petSitterUserInfo.username;

        return {
          ...order,
          petSitterInfo,
          sitterphone,
          sitteraddress,
          sittername,
          userphone,
          useraddress,
          userdetailaddress,
          username,
        };
      }),
    );

    if (ordersWithSitterInfo === null) {
      return res.status(404).json({ message: '전체 예약 내역이 없습니다.' });
    } else {
      res.status(200).json({
        message: '전체 예약 내역 조회가 완료되었습니다.',
        data: ordersWithSitterInfo,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default sitterMyPageRouter;
