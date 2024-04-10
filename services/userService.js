import { User } from '../db/index.js';
import { PetSitter } from '../db/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

class UserService {
  constructor() {
    this.User = User;
  }

  //이메일 중복 검사
  async duplicationCheck(email) {
    const joinuser = await this.User.findOne({ email: email });

    if (joinuser === null || joinuser === undefined) {
      return;
    } else {
      throw new Error('이미 가입된 사용자입니다.')
    }
  }

  // 회원정보 조회
  async getUserInfo(token) {
    const key = process.env.SECRET_KEY;
    const decodeToken = jwt.verify(token, key);

    const userId = decodeToken.userId
    const userInfo = await this.User.findOne({ userId: userId });
    if (userInfo) {
      return userInfo;
    } else {
      const e = new Error('존재하지 않는 사용자 아이디입니다.');
      e.status = 404;
      throw e;
    }
  }


  // 회원가입
  async createUser(info) {
    const { userId, username, email, password, phone, address, detailAddress, isRole } = info;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userId,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      detailAddress,
      isRole,
    });
  }

  //회원정보 수정
  async updateUserInfo(userId, updatedInfo) {
    if (updatedInfo.password) {
      updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
    }
    return await User.findOneAndUpdate(
      { userId: userId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  //회원탈퇴
  async deleteUser(token) {
    const key = process.env.SECRET_KEY;
    const decodeToken = jwt.verify(token, key);

    const userId = decodeToken.userId

    //이메일과 일치하는 user softDelete
    const user = await User.findOne({ userId })

    if (user) {
      user.deletedAt = new Date();
      await user.save();
      return
    }
  }

  //펫시터 등록
  async registerSitter(token, body, uploadimg) {
    try {
      const key = process.env.SECRET_KEY;
      const decodeToken = jwt.verify(token, key);

      const userId = decodeToken.userId;

      const user = await User.findOne({ userId });

      const { sitterId, type, phone, introduction, experience, hourlyRate, title } = body;

      const parsedHourlyRate = JSON.parse(hourlyRate);
      const parsedType = JSON.parse(type);

      if (user.isRole === "1") {
        return { success: false, message: '이미 펫시터 계정입니다.' };
      }

      await PetSitter.create({
        sitterId,
        userId,
        image: uploadimg,
        type: parsedType,
        phone,
        introduction,
        experience,
        hourlyRate: parsedHourlyRate,
        title,
        isRole: "1"
      });

      await User.findOneAndUpdate(
        { userId: userId },
        { isRole: "1" },
        { new: true } //업데이트된 정보 반환
      );

      return { success: true, message: '펫시터 등록 완료!' };
    } catch (error) {
      throw error;
    }
  }

  // 로그인 시 이메일로 사용자 데이터 조회
  async getUserToken(email, password) {
    const user = await User.findOne({ email });

    //soft delete된 사용자인지 확인
    if (user) {
      if (user.deletedAt) {
        throw new Error("탈퇴한 회원입니다.")
      }
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("인증 실패")
    }
    return user;
  }

}

export default new UserService();