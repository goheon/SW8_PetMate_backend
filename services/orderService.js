/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
// 불러오기
const Order = require('../db/index.js');

class OrderService {
  constructor() {
    this.Order = Order;
  }

  // 상품 추가 시 빈 필드 확인
  // eslint-disable-next-line class-methods-use-this
  async checkOrderField(reqBody) {
    // 빈값 확인하는 함수
    function isEmpty(value) {
      return value == null || value === '';
    }
    // 빈값 여부 확인
    const is_empty = Object.values(reqBody).some(isEmpty);
    if (!is_empty) {
      return Object.values(reqBody).some(isEmpty);
    } else {
      const e = new Error('주문을 추가하기 위해선 모든 필드가 채워져야 합니다.');
      e.status = 405;
      throw e;
    }
  }

  // 주문 ID 확인
  async checkOrderId(orderId) {
    const checkOrder = await this.Order.findOne({ _id: orderId });
    if (checkOrder) {
      return checkOrder;
    } else {
      const e = new Error('해당 id의 주문이 없습니다.');
      e.status = 404;
      throw e;
    }
  }

  // 전체 주문 목록
  async getOrderList() {
    return await this.Order.find({});
  }

  // 특정 유저의 주문 목록 조회
  async getOrderListOfUser(userId) {
    return await this.Order.find({ user_id: userId });
  }

  // 주문 추가
  async addOrder(userId) {
    return await this.Order.create({ user_id: userId });
  }

  // 주문 가격
  async setOrder(orderId, orderPrice) {
    return await this.Order.findOneAndUpdate(
      { _id: orderId },
      {
        order_price: orderPrice,
      },
    );
  }

  // 주문 취소
  async cancelOrder(orderId) {
    return await this.Order.deleteOne({ _id: orderId });
  }
}

module.exports = new OrderService();