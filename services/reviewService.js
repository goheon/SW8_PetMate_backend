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
  async writeReview(orderId, reviewInfo, images) {
    const order = await this.Order.findOne({ orderId: orderId });

    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    const { comment, starRate, title } = reviewInfo;

    if (starRate < 0 || starRate > 5) {
      throw new Error('1부터 5 사이의 점수만 입력할 수 있습니다.');
    }

    const user = await this.User.findOne({ userId: order.userId });
    const sitter = await this.PetSitter.findOne({ sitterId: order.sitterId });

    if (!user || !sitter) {
      throw new Error('사용자 또는 펫시터 정보를 찾을 수 없습니다.');
    }

    const newReview = await this.Review.create({
      orderId,
      userId: order.userId,
      sitterId: order.sitterId,
      title,
      comment,
      image: images,
      starRate,
      sitterName: user.username,
      sitterAddress: user.address,
      petInfo: order.pets
    });

    return newReview;
  }

  // 전체 후기 목록 조회
  async getReviewAllList() {
    const allReviews = await this.Review.find({});

    const reviewsWithSitterInfo = [];

    for (const review of allReviews) {
      const sitter = await this.PetSitter.findOne({ sitterId: review.sitterId });

      if (!sitter) {
        // 펫시터 정보가 없는 경우
        reviewsWithSitterInfo.push({
          ...review.toObject(),
          sitterName: '펫시터 정보 없음',
          sitterAddress: '펫시터 정보 없음',
          petInfo: '펫시터 정보 없음'
        });
      } else {
        // 펫시터 정보가 있는 경우
        reviewsWithSitterInfo.push({
          ...review.toObject(),
          sitterName: sitter.name,
          sitterAddress: sitter.address,
          petInfo: sitter.petInfo
        });
      }
    }

    return reviewsWithSitterInfo;
  }

  // 사용자별 후기 목록 조회
  async getReviewList(userId) {
    const userComments = await this.Review.find({ userId });
    const orderIds = userComments.map((comment) => comment.orderId);
    const orders = await this.Order.find({ orderId: { $in: orderIds } });
    const sitterIds = orders.map((order) => order.sitterId);
    const sitters = await this.PetSitter.find({ sitterId: { $in: sitterIds } });

    const commentSitterPairs = userComments.map((comment) => {
      const sitter = sitters.find((sitter) => sitter.sitterId === comment.sitterId);
      return { comment, sitterTitle: sitter ? sitter.title : null };
    });

    return commentSitterPairs;
  }

  // 이용후기에 댓글 추가
  async addCommentToReview(reviewId, sitterId, comment) {
    return await this.Review.findOneAndUpdate(
      { _id: reviewId },
      { $push: { comments: { sitter_id: sitterId, comment } } },
      { new: true }
    );
  }

  // 이용후기 삭제
  async deleteReview(reviewId) {
    return await this.Review.deleteOne({ _id: reviewId });
  }

  // 펫시터별 후기 목록 조회
  async getReviewListBySitter(sitterId) {
    return await this.Review.find({ sitterId });
  }
}

export default ReviewService;