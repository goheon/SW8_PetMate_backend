import { PetSitter } from '../db/index.js';
import { customError } from '../middlewares/errorMiddleware.js';
import { Order } from '../db/index.js';
import { User } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class PetSitterService {
  constructor() {
    this.PetSitter = PetSitter;
    this.Order = Order;
    this.User = User;
  }

  // 모든 펫시터 목록 조회
  async getAllPetSitters() {
    return await this.PetSitter.find({});
  }

  // 특정 펫시터 조회
  async getPetSitterById(sitterId) {
    const petSitter = await this.PetSitter.findOne({ sitterId: sitterId });

    return petSitter;
  }

  // 특정 사용자의 펫시터 조회
  async getPetSitterByUserId(userId) {
    const sitterInfo = await this.PetSitter.findOne({ userId: userId });
    const sitterName = await this.User.findOne({ userId: userId });
    const value = {
      username: sitterName.username,
      address: sitterName.address,
      detailAddress: sitterName.detailAddress,
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

    console.log(updatedInfo);
    const typeArr = updatedInfo.type.split(',');
    const experienceArr = updatedInfo.experience.split(',');
    console.log(typeArr, experienceArr);

    return await this.PetSitter.findOneAndUpdate(
      { sitterId: sitterId },
      {
        sitterId,
        userId,
        image: uploadimg,
        type: typeArr,
        phone,
        introduction,
        experience: experienceArr,
        hourlyRate: parsedHourlyRate,
        title,
      },
      { new: true },
    );
  }

  // 펫시터 삭제
  async deletePetSitter(sitterId) {
    return await this.PetSitter.deleteOne({ sitterId: sitterId });
  }
}

export default new PetSitterService();
