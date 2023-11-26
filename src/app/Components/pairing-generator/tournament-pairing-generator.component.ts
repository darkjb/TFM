import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDTO } from 'src/app/Models/game.dto.js';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-pairing-generator',
  templateUrl: './tournament-pairing-generator.component.html',
  styleUrls: ['./tournament-pairing-generator.component.scss'],
})
export class TournamentPairingGeneratorComponent implements OnInit {
  id: number = 0;
  pairing: ResultDTO[] = [];
  results!: ResultDTO[];
  players!: ParticipantDTO[];
  tournament!: TournamentDTO;
  newTournament!: boolean;
  numPlayers!: number;
  haveBye!: boolean;
  tournamentStarted: boolean;

  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    // this.showButtons = false;
    this.getId();
    this.tournamentStarted = false;
    console.log(this.tournamentStarted);
  }

  async ngOnInit(): Promise<void> {
    await this.getTournamentData();
    this.editBooleans(this.tournament);
    this.newTournament = !this.tournament.started;
    if(this.tournament.started == 1) {
      this.tournamentStarted = true;
    }
    console.log(this.tournamentStarted);
    console.log(this.tournament.started);
  }
  private editBooleans (tournament: TournamentDTO): void
  {
    console.log(tournament);
  }

  private async getId(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
  }

  private async getTournamentData(): Promise<void> {
    const tournaments: TournamentDTO[] =
      await this.dbChessService.getTournamentById('' + this.id);
    this.tournament = tournaments[0];
  }

  async doPairing(): Promise<void> {
    //Recuperem dades i generem l'aparellament
    await this.getParticipants();
    await this.getResults();

    if (this.results.length > 0) {
      const pendingRound = this.lastRoundPending();
      if (pendingRound !== 0) {
        window.alert('La Ronda ' + pendingRound + 'no ha finalitzat');
      }
      this.doNextPairing(pendingRound);
    } else {
      this.doFirstPairing();
      this.doNextPairing(2);
      await this.setTournamentStarted();
    }

    this.pairing.forEach(async (result) => {
      await this.createResults(result);
    });

    window.alert('Aparellament creat correctament =)');
    this.goNextPairing(this.id);
  }
  private async setTournamentStarted() {
    this.tournament.started = 1;
    try {
      await this.dbChessService.updateTournament(this.tournament);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    this.tournamentStarted = true;
  }

  private async getParticipants(): Promise<void> {
    //Recuperem els participants del torneig
    try {
      this.players = await this.dbChessService.getParticipants('' + this.id);
      this.numPlayers = this.players.length;
      if (!(this.numPlayers % 2 == 0)) {
        this.players.push(new ParticipantDTO(this.id, 'Bye', '', 0));
        this.numPlayers++;
        this.haveBye = true;
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  private async getResults(): Promise<void> {
    //Recuperem els resultats del torneig fins al moment
    if (this.newTournament) {
      this.results = [];
    } else {
      try {
        this.results = await this.dbChessService.getResults('' + this.id);
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }
  private doFirstPairing(): void {
    //Funció que genera el primer aparellament
    const mid = this.numPlayers / 2;

    for (let i: number = 0; i < mid; i++) {
      let pair: ResultDTO = new ResultDTO('' + this.id, '1', (i + 1));
      pair.player1 = this.players[i].participantId;
      pair.player2 = this.players[i + mid].participantId;
      this.pairing.push(pair);
    }
  }

  private doNextPairing(round: number): void {
    //Funció que genera els aparellaments del segon en endavant
    const nGroups: number = 2 * round + 1;
    const groups: ParticipantDTO[][] = this.getPlayerGroups(nGroups);
    //    const pGroups: ParticipantDTO[][] = this.getPlayerPlayedGroups();

    let boardNumber = 1;
    for (let i: number = nGroups - 1; i >= 0; i--) {
      if (groups[i].length % 2 !== 0) {
        groups[i - 1].push(groups[i].pop()!);
      }
      for (let j: number = 0; j < groups[i].length; ) {
        if (groups[i].length > 1) {
          const firstPlayer: number = Math.floor(
            Math.random() * groups[i].length
          );
          const p1: ParticipantDTO = groups[i].splice(firstPlayer, 1)[0];
          /*
          const groupP2: ParticipantDTO[] = groups[i].filter((elem) => {
            !pGroups[p1.participantId].includes(elem)
          });
*/
          //Faltaria eliminar, dels que queden, els que ja han jugat contra el p1
          //Faltaria també intentar prioritzar no repetir color en partides successives

          const secondPlayer: number = Math.floor(
            Math.random() * groups[i].length
          );
          const p2: ParticipantDTO = groups[i].splice(secondPlayer, 1)[0];

          let pair: ResultDTO = new ResultDTO(
            '' + this.id,
            '' + (round + 1),
            boardNumber++
          );
          pair.player1 = p1.participantId;
          pair.player2 = p2.participantId;
          this.pairing.push(pair);
        }
      }
    }
  }

  private getPlayerGroups(nGroups: number): ParticipantDTO[][] {
    //Funció per dividir els participants segons la puntuació que porten al torneig
    let groups: ParticipantDTO[][] = new Array<ParticipantDTO[]>(nGroups);

    for (let i: number = 0; i < nGroups; i++) {
      groups[i] = this.players.filter(
        (player) => player.wins + 2 * player.ties === i
      );
    }

    return groups;
  }

  private getPlayerPlayedGroups(): ParticipantDTO[][] {
    //Generem els grups de participants que ja han jugat contra cada participant
    let pGroups: ParticipantDTO[][] = [];
    for (let i: number = 0; i < this.numPlayers; i++) {
      this.results.forEach((result) => this.findPlayers(result, i, pGroups));
    }
    return pGroups;
  }

  private findPlayers(
    result: ResultDTO,
    i: number,
    pGroups: ParticipantDTO[][]
  ): void {
    //Busquem els participants que ja han jugat contra el participant de players[i]
    if (result.player1 == this.players[i].participantId) {
      pGroups[i].push(
        this.players.filter(
          (player) => player.participantId == result.player2
        )[0]
      );
    }
    if (result.player2 == this.players[i].participantId) {
      pGroups[i].push(
        this.players.filter(
          (player) => player.participantId == result.player1
        )[0]
      );
    }
  }

  private async createResults(result: ResultDTO): Promise<void> {
    //Grabem l'aparellament com a resultat buit
    try {
      await this.dbChessService.createResult(result);
      console.log('Aparellament creat correctament =)');
      console.log(
        'Ronda ' +
          result.roundNumber +
          ', tauler ' +
          result.boardNumber +
          ': ' +
          result.player1 +
          ' vs ' +
          result.player2
      );
    } catch (error: any) {
      window.alert(error.error);
    }
  }

  private lastRoundPending(): number {
    //Mirem si algun resultat indica que no ha acabat la ronda
    const res: ResultDTO | undefined = this.results.find(
      (result) => !result.roundEnded
    );
    if (res === undefined) {
      return 0;
    } else {
      return parseInt(res.roundNumber);
    }
  }

  goNextPairing(tournamentId: number): void {
    //Anem a la pàgina d'Aparellaments per a la següent ronda
    this.router.navigateByUrl('/tournament/pairing/' + tournamentId.toString());
  }

  goTournamentDetail(tournamentId: number): void {
    //Anem a la pàgina de Detall del Torneig
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
