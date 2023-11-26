export class GameDTO {
  boardNumber: number;
  player1: string;
  result1: number;
  player2: string;
  result2: number;

  constructor(
    boardNumber: number,
    player1: string,
    result1: number,
    player2: string,
    result2: number
  ) {
    this.boardNumber = boardNumber;
    this.player1 = player1;
    this.result1 = result1;
    this.player2 = player2;
    this.result2 = result2;
  }
}
