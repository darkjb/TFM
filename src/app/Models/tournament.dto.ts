import { BlogDTO } from "./blog.dto";

export class TournamentDTO {
  tournamentId!: number;
  title: string;
  ownerId!: number;
  ownerName?: string;
  arbiterId: number;
  arbiterName?: string;
  moderatorId: number;
  moderatorName?: string;
//  blog!: BlogDTO;
  pairing: number;
  tiebreaker: number;
  started: number;
  finished: number;
  status?: string;

  constructor(title: string, pairing: number, tiebreaker: number) {
    this.title = title;
    this.pairing = pairing;
    this.tiebreaker = tiebreaker;
    this.started = 0;
    this.finished = 0;
    this.arbiterId = 0;
    this.moderatorId = 0;
  }
}
