export class CommentDTO {
  CommentId!: string;
  BlogId!: string;
  userId!: string;
  num_likes: number;
  num_dislikes: number;
  publication_date: Date;

  constructor(num_likes: number, num_dislikes: number, publication_date: Date) {
    this.num_likes = num_likes;
    this.num_dislikes = num_dislikes;
    this.publication_date = publication_date;
  }
}
