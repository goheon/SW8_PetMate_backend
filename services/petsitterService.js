import { PetSitter } from '../db/index.js';
import { customError } from '../middlewares/errorMiddleware.js';
import { Order } from '../db/index.js';
import { User } from '../db/index.js';
import { Review } from '../db/index.js';

class PetSitterService {
  constructor() {
    this.PetSitter = PetSitter;
    this.Order = Order;
    this.User = User;
    this.Review = Review;
  }

  // 모든 펫시터 목록 조회
  async getAllPetSitters() {
    const findSitters = await this.User.find({ isRole: 1 });
    const userIds = findSitters.map((user) => user.userId);
    const sitters = await this.PetSitter.find({ userId: { $in: userIds } });

    const formatSitters = await Promise.all(
      findSitters.map(async (user) => {
        const sitter = sitters.find((sitter) => sitter.userId === user.userId);

        const reviewAll = await this.Review.find({ sitterId: sitter.sitterId });
        const starRate = reviewAll.map((review) => review.starRate);
        const avgStar = starRate.reduce((acc, rate) => acc + rate, 0) / starRate.length;

        return {
          name: user.username,
          address: user.address,
          sitterId: sitter ? sitter.sitterId : null,
          title: sitter ? sitter.title : null,
          type: sitter ? sitter.type : null,
          hourlyRate: sitter ? sitter.hourlyRate : null,
          image: sitter ? sitter.image[0] : null,
          totalReviews: reviewAll.length,
          avgStar: avgStar,
        };
      }),
    );
    return formatSitters;
  }

  // 마이페이지 특정 펫시터 조회
  async getPetSitterByUserId(userId) {
    const petSitter = await this.PetSitter.findOne({ userId: userId });

    return petSitter;
  }

  // 상세예약페이지 특정 사용자의 펫시터 조회
  async getPetSitterById(sitterId) {
    const sitterInfo = await this.PetSitter.findOne({ sitterId: sitterId });
    const sitterName = await this.User.findOne({ userId: sitterInfo.userId });
    const value = {
      username: sitterName.username,
      address: sitterName.address,
      detailAddress: sitterName.detailAddress,
      image: sitterName.image,
    };
    return { sitterInfo, value };
  }

  //펫시터 예약 내역 조회
  async sitterOrderList(sitterId) {
    const orders = await this.Order.find({ sitterId: sitterId });
    if (orders.length === 0) {
      throw new customError('해당하는 id와 일치하는 예약 내역이 없습니다.', 404);
    }
    return orders.map((order) => order.toObject());
  }

  // 펫시터 정보 업데이트
  async updatePetSitter(sitterId, updatedInfo, uploadimg) {
    const { userId, type, phone, introduction, experience, hourlyRate, title } = updatedInfo;
    const parsedHourlyRate = JSON.parse(hourlyRate);

    const typeArr = updatedInfo.type.split(',');
    const experienceArr = updatedInfo.experience.split(',');

    const updateData = {
      sitterId,
      userId,
      type: typeArr,
      phone,
      introduction,
      experience: experienceArr,
      hourlyRate: parsedHourlyRate,
      title,
    };

    if (uploadimg !== null) {
      updateData.image = uploadimg;
    }

    return await this.PetSitter.findOneAndUpdate({ sitterId: sitterId }, updateData, { new: true });
  }

  // 펫시터 삭제
  async deletePetSitter(sitterId) {
    return await this.PetSitter.deleteOne({ sitterId: sitterId });
  }
}

export default new PetSitterService();
