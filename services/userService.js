import { User } from '../db/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

class UserService {
  constructor() {
    this.User = User;
  }

  // 회원정보 조회
  async getUserInfo(userId) {
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
    const { username, email, password, phone, address, detailAddress, isRole } = info;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userId: username,
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
  async deleteUser(userId) {
    return await User.findOneAndDelete({ userId: userId });
  }

  // 로그인 시 이메일로 사용자 데이터 조회
  async getUserToken(email, password) {
    const user=await User.findOne({email});

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        throw new Error("인증 실패")
    }
    return user;
  }
}

export default new UserService();