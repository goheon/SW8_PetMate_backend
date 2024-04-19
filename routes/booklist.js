import express from 'express';
import orderService from '../services/orderService.js';
import { tokenAuthenticated } from '../middlewares/tokenMiddleware.js';
import petsitterService from '../services/petsitterService.js';
import userService from '../services/userService.js';

export const booklistRouter = express.Router();

// 전체 예약 내역 조회
booklistRouter.get('/', tokenAuthenticated, async (req, res, next) => {
  try {
    const orders = await orderService.getOrderListOfUser(req.userId);
    const ordersWithSitterInfo = await Promise.all(
      orders.map(async (order) => {
        const userInfo = await userService.getUserInfo(order.userId);
        const petSitterInfo = await petsitterService.getPetSitterById(order.sitterId);
        const petSitterUserInfo = await userService.getUserInfo(petSitterInfo.sitterInfo.userId);

        const userphone = userInfo.phone;
        const useraddress = userInfo.address;
        const userdetailaddress = userInfo.detailAddress;
        const username = userInfo.username;

        const sitterphone = petSitterUserInfo.phone;
        const sitteraddress = petSitterUserInfo.address;
        const sittername = petSitterUserInfo.username;

        const orderObj = order.toObject();
        return {
          ...orderObj,
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
