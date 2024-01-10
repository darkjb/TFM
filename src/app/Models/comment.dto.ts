export class CommentDTO {
  commentId!: number;
  tournamentId!: number;
  userId!: number;
  ownerName?: string;
  likes: number;
  dislikes: number;
  publicationDate?: string;
  text: string;

  constructor() {
    this.likes = 0;
    this.dislikes = 0;
    this.text = '';
  }
}
