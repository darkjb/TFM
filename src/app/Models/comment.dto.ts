export class CommentDTO {
  commentId!: number;
  tournamentId!: number;
  userId!: number;
  ownerName?: string;
  likes: number;
  dislikes: number;
  publication_date: Date;
  text: string;

  constructor() {
    this.likes = 0;
    this.dislikes = 0;
    this.publication_date = new Date();
    this.text = "";
  }
}
