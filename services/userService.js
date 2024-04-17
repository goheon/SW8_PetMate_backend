import { User } from '../db/index.js';
import { PetSitter } from '../db/index.js';
import { customError } from '../middlewares/errorMiddleware.js';

class UserService {
  constructor() {
    this.User = User;
  }

  // 회원정보 조회
  async getUserInfo(userId) {
    const userInfo = await this.User.findOne({ userId: userId });

    if (userInfo) {
      let loadImage;
      if (userInfo.image) {
        loadImage = userInfo.image;
      } else {
        loadImage = 'https://elice-project2-pet-mate.s3.ap-northeast-2.amazonaws.com/contents/default_profile.png';
      }

      return {
        userId: userInfo.userId,
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
        image: loadImage,
        isRole: userInfo.isRole,
        point: userInfo.point,
      };
    } else {
      throw new customError('존재하지 않는 사용자입니다.', 404);
    }
  }

  // 회원가입
  async createUser(info) {
    const { userId, username, email, password, phone, address, detailAddress, isRole } = info;

    // 이메일 중복 검사
    const joinuser = await this.User.findOne({ email: email });
    if (joinuser) {
      throw new customError('이미 가입된 사용자입니다.', 400);
    }

    await User.create({
      userId,
      username,
      email,
      password,
      phone,
      address,
      detailAddress,
      isRole,
    });
  }

  // 회원 정보 수정
  async updateUserInfo(userId, updatedInfo, uploadimage) {
    const updateFields = { ...updatedInfo };

    if (uploadimage) {
      updateFields.image = uploadimage;
    }

    return await User.findOneAndUpdate({ userId: userId }, { $set: updateFields }, { new: true });
  }

  //회원탈퇴
  async deleteUser(userId) {
    //이메일과 일치하는 user softDelete
    const user = await User.findOne({ userId });

    if (user) {
      user.deletedAt = new Date();
      await user.save();
      return;
    }
  }

  //펫시터 등록
  async registerSitter(userId, body, uploadimg) {
    try {
      const user = await User.findOne({ userId });

      const { sitterId, type, phone, introduction, experience, hourlyRate, title } = body;

      const parsedHourlyRate = JSON.parse(hourlyRate);

      if (user.isRole === '1') {
        return { success: false, message: '이미 펫시터 계정입니다.' };
      }

      const typeArr = type.split(',');
      const experienceArr = experience.split(',');

      const newSitter = await PetSitter.create({
        sitterId,
        userId,
        image: uploadimg,
        type: typeArr,
        phone,
        introduction,
        experience: experienceArr,
        hourlyRate: parsedHourlyRate,
        title,
      });

      await User.findOneAndUpdate(
        { userId: userId },
        { isRole: '1' },
        { new: true }, //업데이트된 정보 반환
      );

      return { success: true, message: '펫시터 등록 완료!', sitterId: newSitter.sitterId };
    } catch (error) {
      throw error;
    }
  }

  // 로그인 시 이메일로 사용자 데이터 조회
  async validlogin(email, password) {
    const user = await User.findOne({ email });

    //soft delete된 사용자인지 확인
    if (user) {
      if (user.deletedAt) {
        throw new customError('탈퇴한 회원입니다.', 400);
      }
    }

    if (password !== user.password) {
      throw new customError('비밀번호가 틀렸습니다.', 401);
    }
    return user;
  }
}

export default new UserService();
