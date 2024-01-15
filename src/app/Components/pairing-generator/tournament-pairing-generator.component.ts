import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { PlayerDTO } from 'src/app/Models/player.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
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
  finished: boolean;
  tournamentStarted: boolean;
  bergerTable: number[][] = [];

  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.getId();
    this.tournamentStarted = false;
    this.finished = false;
  }

  async ngOnInit(): Promise<void> {
    await this.getTournamentData();
    this.newTournament = !this.tournament.started;
    this.tournamentStarted = this.tournament.started === 1;
    this.finished = this.tournament.finished === 1;
  }

  private async getId(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
  }

  private async getTournamentData(): Promise<void> {
    const tournaments: TournamentDTO[] =
      await this.dbChessService.getTournamentById(this.id.toString());
    this.tournament = tournaments[0];
  }

  async doPairing(): Promise<void> {
    //Recuperem dades i generem l'aparellament
    await this.getParticipants();
    if (this.numPlayers === 2 && this.haveBye) {
      window.alert(`No es pot fer un aparellament d'un sol jugador!`)
    } else {
      this.continuePairing();
    }
  }

  async continuePairing(): Promise<void> {
    await this.getResults();

    let playersArray: number[] = this.players.map(
      (player) => player.participantId
    );

    this.bergerTable = this.generateBergerTable(playersArray);

    let nextRound: number = 1;
    if (this.results.length > 0) {
      const pendingRound = this.lastRoundPending();
      if (pendingRound !== 0) {
        window.alert('La Ronda ' + pendingRound + ' no ha finalitzat');
      } else {
        nextRound =
          parseInt(this.results[this.results.length - 1].roundNumber) + 1;
        await this.doNextPairing(nextRound);
        window.alert('Aparellament creat correctament =)');
        this.goNextPairing(this.id);
      }
    } else {
      await this.doNextPairing(nextRound);
      window.alert('Aparellament creat correctament =)');
      await this.setTournamentStarted();
      this.goNextPairing(this.id);
    }
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
      this.players = await this.dbChessService.getParticipants(
        this.id.toString()
      );
      this.numPlayers = this.players.length;
      if (!(this.numPlayers % 2 === 0)) {
        // Si tenim un nombre imparell de participants, generem el participant fictici BYE
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
        this.results = await this.dbChessService.getResults(this.id.toString());
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  private async doNextPairing(round: number): Promise<void> {
    //Funció que genera els aparellaments del segon en endavant
    if (this.tournament.pairing === 1) {
      await this.doSwissPairing(round);
    } else if (this.tournament.pairing === 2) {
      await this.doRobinsonPairing(round);
    }

    this.pairing.forEach(async (result) => {
      await this.createResults(result);
    });
  }

  private async doRobinsonPairing(round: number): Promise<void> {
    // Agafem l'aparellament segons la Taula de Berger que correspon a la ronda actual
    const p = this.bergerTable[round - 1];

    for (let i = 0; i < this.players.length; i += 2) {
      let pair: ResultDTO = new ResultDTO(
        this.id.toString(),
        round.toString(),
        0
      );
      pair.boardNumber = i / 2 + 1;
      pair.player1 = p[i];
      pair.player2 = p[i + 1];

      if (this.haveBye) {
        // Si tenim un BYE, mirem si juga en aquest aparellament
        await this.checkByeBoard(pair);
      }
      this.pairing.push(pair);
      //this.createResults(pair);
    }
  }

  private async createResults(result: ResultDTO): Promise<void> {
    //Grabem l'aparellament com a resultat buit
    try {
      await this.dbChessService.createResult(result);
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

  private generateBergerTable(players: number[]): number[][] {
    const n: number = players.length;
    const table: number[][] = [];

    // Generar la taula Berger
    for (let i = 0; i < n - 1; i++) {
      const row: number[] = [];

      // Parelles de jugadors per a cada ronda
      for (let j = 0; j < n / 2; j++) {
        const playerA = players[j];
        const playerB = players[n - 1 - j];

        // Alterna l'ordre de la parella per cada ronda
        if (i % 2 === 1) {
          row.push(playerB, playerA);
        } else {
          row.push(playerA, playerB);
        }
      }

      // Rotar l'array de jugadors per mantenir l'equitat en les rondes següents
      players.splice(1, 0, players.pop() as number);

      table.push(row);
    }

    return table;
  }

  private async doSwissPairing(round: number): Promise<void> {
    const swissPlayers: PlayerDTO[] = [];

    // Recuperem les dades necessàries de cada jugador per a poder fer l'aparellament
    this.fillPlayerData(swissPlayers);

    // Separem els jugadors per grups de puntuació
    const playerGroups: PlayerDTO[][] = this.getPlayerGroups(
      swissPlayers,
      2 * round - 1
    );

    // I ordenem
    this.sortGroups(playerGroups);

    const wPlayers: PlayerDTO[][] = [];
    const bPlayers: PlayerDTO[][] = [];

    // A cada grup de puntuació separem per preferència de color
    this.divideByColor(playerGroups, wPlayers, bPlayers);

    let board: number = 1;

    for (let i = wPlayers.length - 1; i >= 0; i--) {
      for (let j = 0; j < wPlayers[i].length; j++) {
        // Iterem per obtenir els jugadors de cada tauler
        let pair: ResultDTO = new ResultDTO(
          this.id.toString(),
          round.toString(),
          board
        );

        this.confirmRivals(wPlayers, bPlayers, i, j);

        pair.player1 = wPlayers[i][j].id;
        pair.player2 = bPlayers[i][j].id;

        if (this.haveBye) {
          // Si tenim un BYE, mirem si juga en aquest aparellament
          await this.checkByeBoard(pair);
        }

        this.pairing.push(pair);
        board++;
      }
    }
  }

  private fillPlayerData(array: PlayerDTO[]): void {
    this.players.forEach((player) => {
      let sPlayer: PlayerDTO = new PlayerDTO(player.participantId, player.elo);
      let j: number = 0;

      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i].player1 === player.participantId) {
          sPlayer.historialColores[j] = 1;
          let opponent: ParticipantDTO = this.getWhiteOpponent(i);
          sPlayer.aro += opponent.elo;
          j++;
        }
        if (this.results[i].player2 === player.participantId) {
          sPlayer.historialColores[j] = 0;
          let opponent: ParticipantDTO = this.getBlackOpponent(i);
          sPlayer.aro += opponent.elo;
          j++;
        }
      }

      sPlayer.puntuacio = player.wins + 0.5 * player.ties;
      sPlayer.aro = sPlayer.aro / j;

      array.push(sPlayer);
    });
  }

  private sortWhitePlayers(array: PlayerDTO[]): void {
    array.sort((a, b) => {
      let diff: number;
      if (b.puntuacio !== a.puntuacio) {
        diff = b.puntuacio - a.puntuacio;
      } else {
        diff = a.aro - b.aro;
      }
      return diff;
    });
  }

  private sortBlackPlayers(array: PlayerDTO[]): void {
    array.sort((a, b) => {
      let diff: number;
      if (b.puntuacio !== a.puntuacio) {
        diff = b.puntuacio - a.puntuacio;
      } else {
        diff = b.r - a.r;
      }
      return diff;
    });
  }

  private balanceColors(wPlayers: PlayerDTO[], bPlayers: PlayerDTO[]): void {
    while (wPlayers.length != bPlayers.length) {
      if (wPlayers.length > bPlayers.length) {
        bPlayers.push(wPlayers.pop()!);
      } else {
        wPlayers.push(bPlayers.pop()!);
      }
    }
  }

  private getWhiteOpponent(n: number): ParticipantDTO {
    let player: ParticipantDTO;
    this.players.forEach((elem) => {
      if (elem.participantId === this.results[n].player2) {
        player = elem;
      }
    });
    return player!;
  }

  private getBlackOpponent(n: number): ParticipantDTO {
    let player: ParticipantDTO;
    this.players.forEach((elem) => {
      if (elem.participantId === this.results[n].player1) {
        player = elem;
      }
    });
    return player!;
  }

  private getPlayerGroups(
    players: PlayerDTO[],
    nGroups: number
  ): PlayerDTO[][] {
    //Funció per dividir els participants segons la puntuació que porten al torneig
    let groups: PlayerDTO[][] = [];

    for (let i: number = nGroups - 1; i >= 0; i--) {
      groups[i] = players.filter((player) => 2 * player.puntuacio === i);
    }

    return groups;
  }

  private sortGroups(groups: PlayerDTO[][]): void {
    // Funció que comprova que a cada grup hi hagi un nombre parell de jugadors
    for (let i: number = groups.length - 1; i > 0; i--) {
      if (groups[i].length % 2 !== 0) {
        // Si hi ha un nombre senar, movem un jugador al següent grup de puntuació
        groups[i - 1].push(groups[i].pop()!);
        // Ordenem per puntuació per si cal moure un jugador al següent grup, que sigui el de menor puntuació
        groups[i - 1].sort((a, b) => {
          return b.puntuacio - a.puntuacio;
        });
      }
    }
  }

  private divideByColor(
    playerGroups: PlayerDTO[][],
    wPlayers: PlayerDTO[][],
    bPlayers: PlayerDTO[][]
  ): void {
    for (let i = 0; i < playerGroups.length; i++) {
      const whitePlayers: PlayerDTO[] = [];
      const blackPlayers: PlayerDTO[] = [];

      for (let j = 0; j < playerGroups[i].length; j++) {
        playerGroups[i][j].color = this.ckeckColor(playerGroups[i][j]);
        if (playerGroups[i][j].color === 0) {
          blackPlayers.push(playerGroups[i][j]);
        } else {
          whitePlayers.push(playerGroups[i][j]);
        }
      }

      // Ordenem amb diferent criteri depenent si els toca jugar amb blanques o amb negres
      this.sortWhitePlayers(whitePlayers);
      this.sortBlackPlayers(blackPlayers);

      // Igualem nombre de jugadors que juguen amb blanques i amb negres
      this.balanceColors(whitePlayers, blackPlayers);

      // Tornem a ordenar per si s'han mogut jugadors d'un grup a un altre
      this.sortWhitePlayers(whitePlayers);
      this.sortBlackPlayers(blackPlayers);

      wPlayers.push(whitePlayers);
      bPlayers.push(blackPlayers);
    }
  }

  private confirmRivals(
    wPlayers: PlayerDTO[][],
    bPlayers: PlayerDTO[][],
    i: number,
    j: number
  ): void {
    // Funció que confirma si l'aparellament del grup 'i', jugadors 'j' es pot dur a terme
    // Si és l'últim grup de puntuació i no hi ha més jugadors, es permet repetir rival
    let end: boolean = false; // Variable per controlar que no mirem indefinidament aparellaments al últim grup de puntuació
    let n: number = 1;
    while (this.checkPair(wPlayers[i][j].id, bPlayers[i][j].id) || end) {
      // Si aquest aparellament ja s'ha jugat, movem els jugadors
      if (j === wPlayers[i].length - 1) {
        // Estem intentant aparellar l'últim jugador del grup, mirem si podem canviar amb un jugador del següent grup
        end = this.changeGroup(bPlayers, i);
      } else {
        if (j + n < bPlayers.length) {
          // Encara queda algun jugador del grup per probar, canviem l'ordre i tornem a probar
          this.reOrderPlayers(bPlayers[i], j, n);
          n++;
        } else {
          // No queden jugadors del grup per probar, deixem l'ordre com estava
          this.getOldOrder(bPlayers[i], j, n - 1);
          n = 1;

          // I mirem si podem canviar amb un jugador del següent grup
          end = this.changeGroup(bPlayers, i);
        }
      }
    }
  }

  private checkPair(id1: number, id2: number): boolean {
    return this.checkGames(id1, id2) || this.checkGames(id2, id1);
  }

  private checkGames(p1: number, p2: number): boolean {
    let b: boolean = false;
    this.results.forEach((game) => {
      if (game.player1 === p1 && game.player2 === p2) {
        b = true;
      }
    });
    return b;
  }

  private changeGroup(players: PlayerDTO[][], x: number): boolean {
    // Si x > 0 canvia l'ultim jugador de players[x] amb el primer de players[x-1] i torna true
    // Si x = 0 no fa res i torna false
    let b: boolean = true;
    if (x > 0) {
      players[x - 1].push(players[x].pop()!);
      players[x].push(players[x - 1].shift()!);
      b = false;
    }
    return b;
  }

  private reOrderPlayers(
    players: PlayerDTO[],
    pos: number,
    jump: number
  ): void {
    if (pos + jump < players.length) {
      // Intercanvia els jugadors a les posicions pos i pos+jump
      const temp = players[pos];
      players[pos] = players[pos + jump];
      players[pos + jump] = temp;
    }
  }

  private getOldOrder(players: PlayerDTO[], pos: number, jump: number) {
    for (let i = jump; i > 0; i--) {
      this.reOrderPlayers(players, pos, i);
    }
  }

  // Funció que retorna la preferència de color d'un jugador en funció del seu historial de colors
  private ckeckColor(player: PlayerDTO): number {
    const historial: number[] = player.historialColores;
    const games: number = historial.length;
    // Determinar preferència de color basada en l'historial
    const lastColor: number = historial[games - 1];
    let colorNextRound: number;

    // Preferir color oposat al de l'última partida
    if (lastColor === 0) {
      colorNextRound = 1;
    } else {
      colorNextRound = 0;
    }
    return colorNextRound;
  }

  private async checkByeBoard(pair: ResultDTO): Promise<void> {
    // Si el jugador amb blanques és el BYE, donem la victòria directament al jugador amb negres
    if (pair.player1 === 0) {
      pair.result = 'B';
      let player: ParticipantDTO[] =
        await this.dbChessService.getParicipantById(
          this.id.toString(),
          pair.player2.toString()
        );
      player[0].wins++;
      await this.dbChessService.updateParticipant(player[0]);
    }

    // Si el jugador amb negres és el BYE, donem la victòria directament al jugador amb blanques
    if (pair.player2 === 0) {
      pair.result = 'W';
      let player: ParticipantDTO[] =
        await this.dbChessService.getParicipantById(
          this.id.toString(),
          pair.player1.toString()
        );
      player[0].wins++;
      await this.dbChessService.updateParticipant(player[0]);
    }
  }
}
