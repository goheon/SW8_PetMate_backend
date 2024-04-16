import { Order } from '../db/index.js';
import { User } from '../db/index.js';
import { customError } from '../middlewares/errorMiddleware.js';

class pointService {
  constructor() {
    this.Order = Order;
    this.User = User;
  }

  //포인트 감소
  async pointDecrease(userId, price) {
    const user = await this.User.findOne({ userId: userId });
    const balance = user.point;

    const newBalance = balance - price;

    if (newBalance < 0) {
      throw new customError('포인트가 부족해 결제를 진행할 수 없습니다.', 404);
    }
    await this.User.updateOne({ userId: userId }, { $set: { point: newBalance } }, { new: true });

    return { username: user.username, point: newBalance };
  }


  //포인트 증가 
  async pointIncrease(sitterId, price) {
    const sitter = await this.User.findOne({ userId: sitterId });
    const balance = sitter.point;

    const newBalance = balance + price;

    await this.User.updateOne({ userId: sitterId }, { $set: { point: newBalance } }, { new: true });

    return { username: sitter.username, point: newBalance };
  }
}
export default new pointService();
