import { PetSitter } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class PetSitterService {
  constructor() {
    this.PetSitter = PetSitter;
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
    return await this.PetSitter.findOne({ userId: userId });
  }

  // 펫시터 정보 업데이트
  async updatePetSitter(sitterId, updatedInfo, uploadimg) {
    const { userId, type, phone, introduction, experience, hourlyRate, title } = updatedInfo;
    const parsedHourlyRate = JSON.parse(hourlyRate);

    console.log(updatedInfo);
    // return updatedInfo;
    return await this.PetSitter.findOneAndUpdate(
      { sitterId: sitterId },
      {
        sitterId,
        userId,
        image: uploadimg,
        type,
        phone,
        introduction,
        experience,
        hourlyRate: parsedHourlyRate,
        title,
      },
      { new: true }
    );
  }


  // 펫시터 삭제
  async deletePetSitter(sitterId) {
    return await this.PetSitter.deleteOne({ sitterId: sitterId });
  }
}

export default new PetSitterService();

