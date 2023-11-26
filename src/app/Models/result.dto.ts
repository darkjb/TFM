export class ResultDTO {
  tournamentId: string;
  roundNumber: string;
  boardNumber: number;
  roundEnded: number;
  player1: number;
  player2: number;
  result: string;

  constructor(
    tournamentId: string,
    roundNumber: string,
    boardNumber: number,
  ) {
    this.tournamentId = tournamentId;
    this.roundNumber = roundNumber;
    this.boardNumber = boardNumber;
    this.roundEnded = 0;
    this.player1 = 0;
    this.player2 = 0;
    this.result = ' ';
  }
}
