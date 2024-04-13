// 불러오기
import { Review } from "../db/index.js";
import { Order } from "../db/index.js";
import { User } from "../db/index.js";

class ReviewService {
  constructor() {
    this.Review = Review;
    this.Order= Order;
    this.User=User;
  }

  // 이용후기 작성
  async writeReview(orderId, reviewinfo, images) {
    const reviewId = await this.Order.findOne({ orderId: orderId });

    const { comment, starRate } = reviewinfo;

    if (starRate < 0 || starRate > 6){
      throw new Error("1부터 5사이의 점수만 입력할 수 있습니다.")
    }

    const searchuserId = reviewId.userId;
    const searchsitterId = reviewId.sitterId;

    const searchname= await this.User.findOne({userId : searchuserId});
    const username=searchname.username
  
    return await this.Review.create({
        orderId,
        userId: searchuserId,
        sitterId: searchsitterId,
        username: username,
        comment,
        image: images,
        starRate
      });
  }
  

  // 전체 이용후기 목록 조회
  async getReviewList() {
    return await this.Review.find({});
  }

  // 이용후기에 댓글 추가
  async addCommentToReview(reviewId, sitterId, comment) {
    return await this.Review.findOneAndUpdate(
      { _id: reviewId },
      { $push: { comments: { sitter_id: sitterId, comment: comment } } },
      { new: true }
    );
  }

  // 이용후기 삭제
  async deleteReview(reviewId) {
    return await this.Review.deleteOne({ _id: reviewId });
  }
}

export default ReviewService;