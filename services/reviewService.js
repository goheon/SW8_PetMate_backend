// 불러오기
import { Review } from '../db/index.js';
import { Order } from '../db/index.js';
import { User } from '../db/index.js';
import { PetSitter } from '../db/index.js';

class ReviewService {
  constructor() {
    this.Review = Review;
    this.Order = Order;
    this.User = User;
    this.PetSitter = PetSitter;
  }

  // 이용후기 작성
  async writeReview(orderId, reviewinfo, images) {
    const reviewId = await this.Order.findOne({ orderId: orderId });

    const { comment, starRate, title } = reviewinfo;

    if (starRate < 0 || starRate > 6) {
      throw new Error('1부터 5사이의 점수만 입력할 수 있습니다.');
    }

    const searchuserId = reviewId.userId;
    const searchsitterId = reviewId.sitterId;

    const searchname = await this.User.findOne({ userId: searchuserId });
    const username = searchname.username;
    const userProfileImg = searchname.image[0];

    await this.Order.findOneAndUpdate(
      { orderId: orderId },
      { reviewWritten: '1' },
      { new: true }, //업데이트된 정보 반환
    );

    const newReview = await this.Review.create({
      orderId,
      userId: searchuserId,
      sitterId: searchsitterId,
      title,
      comment,
      image: images,
      starRate,
    });

    const writerInfo = { username, userProfileImg };
    return { newReview, writerInfo };
  }

  // 사용자별 후기 목록 조회
  async getReviewList(userId) {
    const userComments = await this.Review.find({ userId: userId });
    // 작성한 리뷰의 orderId로 주문 검색
    const orderIds = userComments.map((order) => order.orderId);
    const orders = await this.Order.find({ orderId: { $in: orderIds } });

    // 예약한 펫시터와 일치하는 펫시터 찾기
    const sitterIds = orders.map((order) => order.sitterId);
    const sitters = await this.PetSitter.find({ sitterId: { $in: sitterIds } });

    // 리뷰의 sitterId와 일치하는 펫시터의 타이틀을 코멘트와 쌍으로 가져오기
    const commentSitterPairs = userComments.map((comment) => {
      const order = orders.find((order) => order.orderId === comment.orderId);
      if (!order) return null;
      const sitter = sitters.find((sitter) => sitter.sitterId === order.sitterId);
      return { comment: comment, sitterTitle: sitter ? sitter.title : null };
    });

    return commentSitterPairs;
  }

  // 이용후기에 댓글 추가
  async addCommentToReview(reviewId, sitterId, comment) {
    return await this.Review.findOneAndUpdate(
      { _id: reviewId },
      { $push: { comments: { sitter_id: sitterId, comment: comment } } },
      { new: true },
    );
  }

  // 이용후기 삭제
  async deleteReview(reviewId) {
    return await this.Review.deleteOne({ _id: reviewId });
  }

  // 펫시터별 후기 목록 조회
  async getReviewListBySitter(sitterId) {
    const reviews = await this.Review.find({ sitterId: sitterId });

    const reviewsWithValue = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.User.findOne({ userId: review.userId });

        const value = {
          username: user.username,
          image: user.image,
        };

        return {
          review: review.toObject(),
          value: value,
        };
      }),
    );

    return reviewsWithValue;
  }

  // 메인 페이지 전체 후기 목록 조회
  async getReviewAllList() {
    const allReviews = await this.Review.find({});

    const reviewsWithValue = await Promise.all(
      allReviews.map(async (review) => {
        const user = await this.User.findOne({ userId: review.userId });
        const order = await this.Order.findOne({ orderId: review.orderId });

        if (!user || !order) {
          throw new Error('사용자 정보 또는 주문 정보를 찾을 수 없습니다.');
        }

        const value = {
          username: user.username,
          address: user.address,
          detailAddress: user.detailAddress,
          image: user.image,
          petInfo: order.pets,
        };

        return {
          review: review.toObject(),
          value: value,
        };
      }),
    );

    return reviewsWithValue;
  }
}
export default ReviewService;
