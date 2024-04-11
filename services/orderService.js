import { Order } from '../db/index.js';
import jwt from 'jsonwebtoken';

class OrderService {
  constructor() {
    this.Order = Order;
  }

  // 주문 ID 확인
  async checkOrderId(orderId) {
    const checkOrder = await this.Order.findOne({ orderId: orderId });
    if (checkOrder) {
      return checkOrder;
    } else {
      const e = new Error('해당 주문식별 아이디의 주문이 없습니다.');
      e.status = 404;
      throw e;
    }
  }

  // 전체 주문 목록
  async getOrderList() {
    return await this.Order.find({});
  }

  // 특정 사용자의 주문 목록 조회
  async getOrderListOfUser(userId) {
    const key = process.env.SECRET_KEY;
    const decodeToken = jwt.verify(userId, key);
    const userId1 = decodeToken.userId;
    console.log(userId1);
    return await this.Order.find({ userId: userId1 });

  }

  // 주문 추가
  async addOrder(sitterId, orderInfo, token) {
    const { orderId, pets, totalPrice, detailInfo, startDate, endDate } = orderInfo;
    const currentDate = new Date().toISOString();

    const key = process.env.SECRET_KEY;
    const decodeToken = jwt.verify(token, key);
    const userId = decodeToken.userId;

    const newOrder= await this.Order.create({
      orderId,
      userId,
      sitterId,
      pets,
      totalPrice,
      createdAt: currentDate,
      state: "예약요청",
      detailInfo,
      startDate,
      endDate
    });
    return { success: true, message: '예약완료!', orderId: newOrder.orderId };
  }

  // 주문 수정
  async updateOrder(orderId, updatedInfo) {
    return await this.Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  // 주문 취소
  async cancelOrder(orderId) {
    return await this.Order.deleteOne({ orderId: orderId });
  }

  // 주문 완료
  async completeOrder(userId, orderId) {
    return await this.Order.findOneAndUpdate(
      { userId: userId, orderId: orderId },
      { $set: { state: '완료' } },
      { new: true }
    );
  }
  // 주문 상태 변경
  async updateOrderStatus(orderId, state) {
    return await this.Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: { state: state } },
      { new: true }
    );
  }
}


export default new OrderService();

