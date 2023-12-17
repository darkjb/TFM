import { BlogDTO } from "./blog.dto";

export class TournamentDTO {
  tournamentId!: number;
  title: string;
  ownerId!: number;
  ownerName?: string;
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
  }
}
