import { Order } from '../db/index.js';
import { User } from '../db/index.js';
import { PetSitter } from '../db/index.js';
import { customError } from '../middlewares/errorMiddleware.js';

class pointService {
  constructor() {
    this.Order = Order;
    this.User = User;
    this.PetSitter = PetSitter;
  }

  //포인트 증가감소
  async pointFunction(orderId) {
    const order = await this.Order.findOne({ orderId: orderId });
    const price = order.totalPrice;
    const user = await this.User.findOne({ userId: order.userId });

    const sitter = await this.PetSitter.findOne({ sitterId: order.sitterId });
    const sitterPoint = await this.User.findOne({ userId: sitter.userId });

    const userBalance = user.point;
    const sitterBalance = sitterPoint.point;

    const increase = sitterBalance + price;
    const decrease = userBalance - price;

    if (decrease < 0) {
      throw new customError('포인트가 부족해 결제를 진행할 수 없습니다.', 404);
    }

    await this.User.updateOne({ userId: user.userId }, { $set: { point: decrease } }, { new: true });
    await this.User.updateOne({ userId: sitterPoint.userId }, { $set: { point: increase } }, { new: true });

    return {
      username: user.username,
      decpoint: decrease,
      sittername: sitterPoint.username,
      incpoint: increase,
    };
  }
}

export default new pointService();
