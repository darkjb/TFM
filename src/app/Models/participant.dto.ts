export class ParticipantDTO {
  participantId: number;
  tournamentId: number;
  name: string;
  surname: string;
  elo: number;
  wins: number;
  ties: number;
  loses: number;
  white: number;
  black: number;
  last: string;

  constructor(
    tournamentId: number,
    name: string,
    surname: string,
    elo: number
  ) {
    this.participantId = 0;
    this.tournamentId = tournamentId;
    this.name = name;
    this.surname = surname;
    this.elo = elo;
    this.wins = 0;
    this.ties = 0;
    this.loses = 0;
    this.white = 0;
    this.black = 0;
    this.last = '';
  }
}
