const User = require('../db/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


class UserService {
  constructor() {
    this.User = User;
  }

  // 회원정보 조회
  async getUserInfo(userId) {
    const userInfo = await this.User.findOne({ _id: userId });
    if (userInfo) {
      return userInfo;
    } else {
      const e = new Error('존재하지 않는 회원번호입니다.');
      e.status = 404;
      throw e;
    }
  }

  // 회원가입
  async createUser(info) {
    const { name, email, password, address, tel } = info;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      tel,
    });
  }

  //회원정보 수정
  async updateUserInfo(userId, updatedInfo) {
    if (updatedInfo.password) {
      updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
    }
    // findOneAndUpdate 메서드를 사용하여 사용자 정보 업데이트
    return await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  //회원탈퇴
  async deleteUser(userId) {
    return await User.findOneAndDelete({ _id: userId });
  }

  // 로그인 시 이메일로 사용자 데이터 조회
  async getUserToken(userId, userPw) {
    const userData = await User.findOne({ email: userId });

    // 사용자 데이터가 없으면 로그인 실패
    if (!userData) {
      const e = new Error('올바르지 않은 ID');
      e.status = 404;
      throw e;
    }

    // 로그인 시 저장된 비밀번호와 입력된 비밀번호 비교
    const comparePassword = await this.comparePasswords(
      userPw,
      userData.password
    );

    // 비밀번호가 틀리면 로그인 실패
    if (!comparePassword) {
      const e = new Error('올바르지 않은 비밀번호');
      e.status = 404;
      throw e;
    }

    // 로그인 성공 후 토큰 반환
    const secretKey = process.env.JWT_SECRET_KEY; // env 설정 필요
    return jwt.sign({
      userId: userData._id,
      isAdmin: false,
    }, secretKey);
  }

  async comparePasswords(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }


}

module.exports = new UserService();
