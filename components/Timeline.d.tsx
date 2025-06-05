/**
 * Post 게시글 구조
 */
export interface IPost {
  /**게시글 ID */
  id: string;
  /** 작성자 유저 ID */
  userId: string;
  /** 작성 시간 */
  createdAt: number;
  /** 작성 내용 */
  caption: string;
  /** 작성자 별칭 */
  nickname: string;
  /**작성글 첨부사진 */
  photos: string[];
}
