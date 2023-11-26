import { CommentDTO } from "./comment.dto";

export class BlogDTO {
  BlogId!: string;
  tournamentId!: string;
  ownerId!: string;
  moderatorId?: string[];
  comments!: CommentDTO[];

  constructor() {}
}
